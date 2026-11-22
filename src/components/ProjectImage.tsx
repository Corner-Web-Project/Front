import { useState } from 'react';

interface ProjectImageProps {
  src: string | undefined;
  alt: string;
  className: string;
  placeholder: string;
}

export default function ProjectImage({ src, alt, className, placeholder }: ProjectImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>();

  if (!src || failedSrc === src) {
    return <div role="img" aria-label={placeholder} className={`${className} bg-gray-100`} />;
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}
