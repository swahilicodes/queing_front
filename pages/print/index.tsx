import Printable from '@/components/printable/printable'
import React, { useEffect } from 'react'
import styles from './print.module.scss'
import { useRouter } from 'next/router'

export default function Print() {
  return (
    <div className={styles.print}>
        <Printable/>
    </div>
  )
}
