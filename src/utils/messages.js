import invariant from 'invariant';

 let messages = {
  date: 'Date',
  time: 'Time',
  event: 'Event',
  allDay: 'all day',
  week: 'week',
  day: 'day',
  month: 'month',
  previous: 'back',
  next: 'next',
  yesterday: 'yesterday',
  tomorrow: 'tomorrow',
  today: 'today',
  agenda: 'agenda'
}

export function set(key, msg){
  invariant(messages.hasOwnProperty(key),
    `The message key: "${key}" is not a valid message name. ` +
    `valid keys are: ${Object.keys(messages).join(', ')}`
  )

  messages[key] = msg;
}

export default function messages(msgs){
  return {
    ...messages,
    ...msgs
  }
}