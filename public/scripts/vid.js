
  const videos = document.querySelectorAll("video[data-src]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const source = video.querySelector("source");
        source.src = video.dataset.src;
        video.load();
        observer.unobserve(video);
      }
    });
  });
  videos.forEach(v => observer.observe(v));