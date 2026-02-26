
import { type InputHTMLAttributes } from 'react'

import styles from './Checkbox.module.scss'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`${styles.wrapper} ${className}`.trim()}>
      <input type="checkbox" className={styles.input} {...props} />
      <span className={styles.box} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
