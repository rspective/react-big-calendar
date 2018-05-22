import PropTypes from 'prop-types'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import cn from 'classnames'

import dates from '../../utils/dates'
import { accessor } from '../../utils/propTypes'
import DraggableEventWrapper from './DraggableEventWrapper'
import ResizableEvent from './ResizableEvent'
import ResizableMonthEvent from './ResizableMonthEvent'
import { DayWrapper, DateCellWrapper } from './backgroundWrapper'

let html5Backend

try {
  html5Backend = require('react-dnd-html5-mixed-backend')
} catch (err) {
  /* optional dep missing */
}

export default function withDragAndDrop(
  Calendar,
  { backend = html5Backend } = {}
) {
  class DragAndDropCalendar extends React.Component {
    static propTypes = {
      selectable: PropTypes.oneOf([true, false, 'ignoreEvents']).isRequired,
      components: PropTypes.object,
    }
    getChildContext() {
      return {
        onEventDrop: this.props.onEventDrop,
        onEventResize: this.props.onEventResize,
        startAccessor: this.props.startAccessor,
        endAccessor: this.props.endAccessor,
      }
    }

    constructor(...args) {
      super(...args)
      this.state = { isDragging: false }
    }

    componentWillMount() {
      let monitor = this.context.dragDropManager.getMonitor()
      this.monitor = monitor
      this.unsubscribeToStateChange = monitor.subscribeToStateChange(
        this.handleStateChange
      )
    }

    componentWillUnmount() {
      this.monitor = null
      this.unsubscribeToStateChange()
    }

    handleStateChange = () => {
      const item = this.monitor.getItem()
      const isDragging = !!item
      window.resizedEvent = item ? item : null
      if (window.meetingDuration && window.resizeType && window.resizedEvent) {
        const handlers = this.monitor.registry.handlers
        const handlersKeys = Object.keys(handlers)
        const cellOver = handlersKeys
          .map(k => handlers[k].component.props)
          .filter(p => p.isOver)
          .pop()
        if (cellOver) {
          const dateCell = cellOver.value
          let duration = 0
          let direction = null
          if (window.dateCell) {
            direction = +dateCell < +window.dateCell ? 'up' : 'down'
            window.dateCell = dateCell
            let startDate
            let endDate
            const step = 15
            if (window.resizeType === 'resizeBottom') {
              startDate = item.start
              endDate = dateCell
              if (direction === 'up')
                endDate.setMinutes(endDate.getMinutes() - step)
              if (direction === 'down')
                endDate.setMinutes(endDate.getMinutes() + step)
            } else if (window.resizeType === 'resizeTop') {
              startDate = dateCell
              endDate = item.end
              if (direction === 'up')
                startDate.setMinutes(startDate.getMinutes() - step)
              if (direction === 'down')
                startDate.setMinutes(startDate.getMinutes() + step)
            }
            duration = dates.diff(startDate, endDate) / 60000

            // TEMP: wrong calculation on direction=up => don't show meeting duration
            if (direction === 'up') {
              window.meetingDuration.style.display = 'none'
              duration = 0
            }
          } else {
            window.dateCell = dateCell
          }
          if (duration) {
            let h = Math.floor(duration / 60)
            let m = duration % 60
            h = h < 10 ? '0' + h : h
            m = m < 10 ? '0' + m : m
            window.meetingDuration.innerHTML = h + ':' + m
            window.meetingDuration.style.top = window.meetingDurationY + 'px'
            window.meetingDuration.style.left = window.meetingDurationX + 'px'
            window.meetingDuration.style.display = 'block'
          } else {
            window.meetingDuration.innerHTML = ''
            window.meetingDuration.style.display = 'none'
          }
        }
      }

      if (isDragging !== this.state.isDragging) {
        setTimeout(() => this.setState({ isDragging }))
      }
    }

    render() {
      const { selectable, components, resizable, ...props } = this.props

      delete props.onEventDrop
      delete props.onEventResize

      props.selectable = selectable ? 'ignoreEvents' : false

      props.className = cn(
        props.className,
        'rbc-addons-dnd',
        this.state.isDragging && 'rbc-addons-dnd-is-dragging'
      )

      props.components = {
        ...components,
        dateCellWrapper: DateCellWrapper,
        day: { event: resizable && ResizableEvent },
        dayWrapper: DayWrapper,
        eventWrapper: DraggableEventWrapper,
        month: { event: resizable && ResizableMonthEvent },
        week: { event: resizable && ResizableEvent },
      }

      return <Calendar {...props} />
    }
  }

  DragAndDropCalendar.propTypes = {
    onEventDrop: PropTypes.func.isRequired,
    resizable: PropTypes.bool,
    onEventResize: PropTypes.func,
    startAccessor: accessor,
    endAccessor: accessor,
  }

  DragAndDropCalendar.defaultProps = {
    startAccessor: 'start',
    endAccessor: 'end',
  }

  DragAndDropCalendar.contextTypes = {
    dragDropManager: PropTypes.object,
  }

  DragAndDropCalendar.childContextTypes = {
    onEventDrop: PropTypes.func,
    onEventResize: PropTypes.func,
    startAccessor: accessor,
    endAccessor: accessor,
  }

  if (backend === false) {
    return DragAndDropCalendar
  } else {
    return DragDropContext(backend)(DragAndDropCalendar)
  }
}
