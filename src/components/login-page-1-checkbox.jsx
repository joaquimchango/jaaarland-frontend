'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'

import { cn } from '@/lib/utils'

/**
 * Checkbox with an animated check: the box fills first, then the mark draws
 * itself via stroke-dashoffset. Kept local to this block rather than patched
 * into `@/components/ui/checkbox` so the animation actually ships - the shadcn
 * checkbox you install from the registry renders a static icon.
 *
 * strokeDasharray is the path's total length (rounded up) so the draw never
 * over- or under-shoots.
 */
const CHECK_PATH_LENGTH = 15

export function LoginPage1Checkbox({
  className,
  ...props
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn(
        'group peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input outline-none transition-[background-color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary motion-reduce:transition-none',
        className
      )}
      {...props}>
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        keepMounted
        className='grid place-content-center text-current'>
        <svg
          viewBox='0 0 10.1668 10.1668'
          className='size-2.5'
          fill='none'
          stroke='currentColor'
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path
            d='M1 5.52L3.92 9.17L9.17 1'
            className={cn(
              '[stroke-dashoffset:15px]',
              'transition-[stroke-dashoffset] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'group-data-checked:[stroke-dashoffset:0px] group-data-checked:duration-[350ms]',
              'motion-reduce:transition-none'
            )}
            style={{ strokeDasharray: CHECK_PATH_LENGTH }} />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
