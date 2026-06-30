// Arabiyomi — نطق صوتي للمفردات العربية
// يعمل بطريقتين تلقائيًا:
// 1) لو الموقع مفتوح جوه تطبيق Android (MIT App Inventor WebView) → يستخدم TextToSpeech بتاع التطبيق
// 2) لو الموقع مفتوح في متصفح عادي (Chrome/Edge) → يستخدم خاصية النطق المدمجة في المتصفح (Web Speech API)

document.addEventListener('DOMContentLoaded', function () {

  function isInsideAppInventor() {
    return (typeof window.AppInventor !== 'undefined' &&
            typeof window.AppInventor.setWebViewString === 'function');
  }

  function speakViaAppInventor(text) {
    // بيبعت النص لـ App Inventor، وبعدين الـ Blocks بتاعة التطبيق
    // (WebViewer1.WebViewStringChanged → TextToSpeech1.Speak) بتقرأه
    window.AppInventor.setWebViewString(text + "|" + Date.now());
  function speakViaBrowser(text) {
    if (!('speechSynthesis' in window)) {
      alert('عفوًا، متصفحك لا يدعم النطق الصوتي. جرّب Chrome أو Edge.');
      return;
    }
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ar-SA';
    utter.rate = 0.85;

    var voices = window.speechSynthesis.getVoices();
    var arVoice = voices.find(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf('ar') === 0;
    });
    if (arVoice) utter.voice = arVoice;

    window.speechSynthesis.speak(utter);
  }

  function speakArabic(text) {
    if (isInsideAppInventor()) {
      speakViaAppInventor(text);
    } else {
      speakViaBrowser(text);
    }
  }

  // تحميل الأصوات مسبقًا (بعض المتصفحات تحتاج هذا الحدث)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {
      window.speechSynthesis.getVoices();
    };
  }

  document.querySelectorAll('.play-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var row = btn.closest('tr');
      if (!row) return;
      var arCell = row.querySelector('.vocab-ar');
      if (!arCell) return;
      speakArabic(arCell.textContent.trim());
    });
  });

});
