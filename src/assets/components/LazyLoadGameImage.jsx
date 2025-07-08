import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function LazyLoadGameImage({ image }) {
  return (
    <LazyLoadImage
      alt="game image"
      effect="blur"
      src={image}
      width="100%"
      height="192px"
      style={{
        objectFit: 'cover',
        borderRadius: '8px 8px 0 0',
        transitionDelay: '0.5s'
      }}
    />
  );
}
