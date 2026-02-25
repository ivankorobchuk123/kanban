import styles from './Avatar.module.scss';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  return (
    <div className={`${styles.avatar} ${styles[size]} ${className ?? ''}`.trim()}>
      <img src={src} alt={alt} />
    </div>
  );
}
