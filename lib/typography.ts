// Apply readable Myanmar typography to mixed-script names as well as Burmese-only names.
export function stallTitleClass(name: string) {
  return /\p{Script=Myanmar}/u.test(name) ? 'stall-title stall-title--myanmar' : 'stall-title';
}
