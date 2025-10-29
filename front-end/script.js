
  function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateProgressCircles();
  }

  function updateProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach(el => {
      const value = el.dataset.progress;
      const circle = el.querySelector('.progress-bar');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference;
      const offset = circumference - (value / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    });
  }

  updateProgressCircles();
