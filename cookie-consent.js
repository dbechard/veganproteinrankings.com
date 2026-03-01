// Cookie Consent Functions
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function loadAds() {
  if (getCookie('cookie_consent') === 'true') {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7282675489165683';
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.head.appendChild(script);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const banner = document.getElementById('cookieConsent');
  
  if (!getCookie('cookie_consent')) {
    banner.style.display = 'block';
  }

  document.getElementById('acceptCookies').addEventListener('click', function() {
    document.cookie = 'cookie_consent=true; max-age=31536000; path=/'; // 1 year
    banner.style.display = 'none';
    loadAds();
  });

  document.getElementById('declineCookies').addEventListener('click', function() {
    document.cookie = 'cookie_consent=false; max-age=31536000; path=/'; // 1 year
    banner.style.display = 'none';
  });

  if (getCookie('cookie_consent') === 'true') {
    loadAds();
  }
});
