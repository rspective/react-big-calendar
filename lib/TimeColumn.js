'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

exports.__esModule = true
exports.default = void 0

var _inheritsLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inheritsLoose')
)

var _propTypes = _interopRequireDefault(require('prop-types'))

var _react = _interopRequireWildcard(require('react'))

var _classnames = _interopRequireDefault(require('classnames'))

var _dates = _interopRequireDefault(require('./utils/dates'))

var _propTypes2 = require('./utils/propTypes')

var _BackgroundWrapper = _interopRequireDefault(require('./BackgroundWrapper'))

var _TimeSlotGroup = _interopRequireDefault(require('./TimeSlotGroup'))

var TimeColumn =
  /*#__PURE__*/
  (function(_Component) {
    ;(0, _inheritsLoose2.default)(TimeColumn, _Component)

    function TimeColumn() {
      return _Component.apply(this, arguments) || this
    }

    var _proto = TimeColumn.prototype

    _proto.renderTimeSliceGroup = function renderTimeSliceGroup(
      key,
      isNow,
      date,
      resource
    ) {
      var _this$props = this.props,
        dayWrapperComponent = _this$props.dayWrapperComponent,
        timeslots = _this$props.timeslots,
        showLabels = _this$props.showLabels,
        step = _this$props.step,
        slotPropGetter = _this$props.slotPropGetter,
        dayPropGetter = _this$props.dayPropGetter,
        timeGutterFormat = _this$props.timeGutterFormat,
        culture = _this$props.culture
      return _react.default.createElement(_TimeSlotGroup.default, {
        key: key,
        isNow: isNow,
        value: date,
        step: step,
        slotPropGetter: slotPropGetter,
        dayPropGetter: dayPropGetter,
        culture: culture,
        timeslots: timeslots,
        resource: resource,
        showLabels: showLabels,
        timeGutterFormat: timeGutterFormat,
        dayWrapperComponent: dayWrapperComponent,
      })
    }

    _proto.render = function render() {
      var _this$props2 = this.props,
        className = _this$props2.className,
        children = _this$props2.children,
        style = _this$props2.style,
        getNow = _this$props2.getNow,
        min = _this$props2.min,
        max = _this$props2.max,
        step = _this$props2.step,
        timeslots = _this$props2.timeslots,
        resource = _this$props2.resource

      var totalMin = _dates.default.diff(min, max, 'minutes')

      var numGroups = Math.ceil(totalMin / (step * timeslots))
      var renderedSlots = []
      var groupLengthInMinutes = step * timeslots
      var date = min
      var next = date
      var now = getNow()
      var isNow = false

      for (var i = 0; i < numGroups; i++) {
        isNow = _dates.default.inRange(
          now,
          date,
          _dates.default.add(next, groupLengthInMinutes - 1, 'minutes'),
          'minutes'
        )
        next = _dates.default.add(date, groupLengthInMinutes, 'minutes')

        if (className === 'rbc-time-gutter' && +date === +next) {
          // Safari bug
          next = _dates.default.add(date, groupLengthInMinutes * 2, 'minutes')
        }

        renderedSlots.push(this.renderTimeSliceGroup(i, isNow, date, resource))
        date = next
      }

      return _react.default.createElement(
        'div',
        {
          className: (0, _classnames.default)(className, 'rbc-time-column'),
          style: style,
        },
        renderedSlots,
        children
      )
    }

    return TimeColumn
  })(_react.Component)

exports.default = TimeColumn
TimeColumn.propTypes = {
  step: _propTypes.default.number.isRequired,
  culture: _propTypes.default.string,
  timeslots: _propTypes.default.number.isRequired,
  getNow: _propTypes.default.func.isRequired,
  min: _propTypes.default.instanceOf(Date).isRequired,
  max: _propTypes.default.instanceOf(Date).isRequired,
  showLabels: _propTypes.default.bool,
  timeGutterFormat: _propTypes2.dateFormat,
  type: _propTypes.default.string.isRequired,
  className: _propTypes.default.string,
  resource: _propTypes.default.string,
  slotPropGetter: _propTypes.default.func,
  dayPropGetter: _propTypes.default.func,
  dayWrapperComponent: _propTypes2.elementType,
}
TimeColumn.defaultProps = {
  step: 30,
  timeslots: 2,
  showLabels: false,
  type: 'day',
  className: '',
  dayWrapperComponent: _BackgroundWrapper.default,
}
module.exports = exports['default']
