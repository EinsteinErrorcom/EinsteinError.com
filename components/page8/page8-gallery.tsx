type Page8GalleryProps = {
  images: string[];
};

export function Page8Gallery({ images }: Page8GalleryProps) {
  if (images.length === 0) {
    return (
      <p className="page8__empty">
        No images found in <code>public/page8/</code>.
      </p>
    );
  }

  return (
    <div className="page8__gallery">
      {images.map((filename, index) => (
        <figure className="media" key={filename}>
          <img
            src={`/page8/${filename}`}
            alt={`Page 8 slide ${index + 1}`}
            width={700}
            height={400}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}
