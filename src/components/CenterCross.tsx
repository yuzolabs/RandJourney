import styles from './CenterCross.module.css'

export default function CenterCross() {
  return <div className={styles.cross} data-testid="center-cross" aria-hidden="true" />
}
