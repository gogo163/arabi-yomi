document.addEventListener('DOMContentLoaded', function () {

  function isInsideAppInventor() {
    return (typeof window.AppInventor !== 'undefined' &&
            typeof window.AppInventor.setWebViewString === 'function');
  }

  document.querySelectorAll('.play-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var row = btn.closest('tr');
      if (!row) return;
      var arCell = row.querySelector('.vocab-ar');
      if (!arCell) return;
      var text = arCell.textContent.trim() + "\u200B";
      
      if (isInsideAppInventor()) {
        window.AppInventor.setWebViewString(text);
      } else {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ar-SA';
        window.speechSynthesis.speak(utter);
      }
    });
  });

});
