// client/src/utils/tailwind.js

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}