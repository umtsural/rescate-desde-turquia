// Interactivity for Rescate desde Turquía: contact form, newsletter and dog photo galleries.
(function () {
  'use strict';
  var cfg = window.SITE_CONFIG || {};
  var lang = document.documentElement.lang || 'es';
  var EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function show(scope, name, on) {
    scope.querySelectorAll('[data-if="' + name + '"]').forEach(function (el) { el.hidden = !on; });
  }

  // Sends a submission to Web3Forms, which emails it to the address the access key was created for.
  function sendWeb3Forms(data) {
    if (!cfg.web3formsAccessKey) {
      return Promise.reject(new Error('web3formsAccessKey is not set (see README).'));
    }
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({ access_key: cfg.web3formsAccessKey }, data)),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (!res.ok || !json.success) throw new Error(json.message || 'Submission failed');
        return json;
      });
    });
  }

  // ---- Contact form ----
  document.querySelectorAll('[data-form="contact"]').forEach(function (form) {
    var btn = form.querySelector('[data-on="submit"]');
    var resetBtn = form.querySelector('[data-on="reset"]');
    var field = function (n) { return form.querySelector('[name="' + n + '"]'); };

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { show(form, 'error', false); show(form, 'sendErr', false); });
    });

    btn.addEventListener('click', function () {
      var reason = field('reason');
      var data = {
        name: field('name').value.trim(),
        email: field('email').value.trim(),
        phone: field('phone').value.trim(),
        reason: reason.options[reason.selectedIndex].text,
        dog: field('dog').value || '—',
        message: field('message').value.trim(),
      };
      if (!data.name || !EMAIL.test(data.email) || !data.message || !field('consent').checked) {
        show(form, 'error', true);
        return;
      }
      if (field('botcheck') && field('botcheck').checked) return; // spam bot
      btn.disabled = true;
      sendWeb3Forms({
        subject: 'Web · ' + data.reason + (data.dog !== '—' ? ' · ' + data.dog : ''),
        from_name: 'Web Rescate desde Turquía',
        Nombre: data.name,
        email: data.email,
        Teléfono: data.phone || '—',
        Motivo: data.reason,
        Perro: data.dog,
        Mensaje: data.message,
        Idioma: lang,
      }).then(function () {
        show(form, 'sent', true);
        show(form, 'notSent', false);
      }).catch(function (err) {
        console.error(err);
        show(form, 'sendErr', true);
      }).then(function () { btn.disabled = false; });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.querySelectorAll('input, textarea').forEach(function (el) {
          if (el.type === 'checkbox') el.checked = false; else el.value = '';
        });
        form.querySelectorAll('select').forEach(function (el) { el.selectedIndex = 0; });
        show(form, 'sent', false);
        show(form, 'notSent', true);
      });
    }
  });

  // ---- Newsletter ----
  document.querySelectorAll('[data-form="newsletter"]').forEach(function (box) {
    var btn = box.querySelector('[data-on="nlSubmit"]');
    var input = box.querySelector('input[name="email"]');
    var submit = function () {
      var email = input.value.trim();
      show(box, 'nlSendErr', false);
      if (!EMAIL.test(email)) { show(box, 'nlErr', true); return; }
      show(box, 'nlErr', false);
      btn.disabled = true;
      var request;
      if (cfg.newsletterAction) {
        // Newsletter tool form (e.g. Brevo / Mailchimp embedded form action URL).
        var fd = new FormData();
        fd.append('EMAIL', email);
        request = fetch(cfg.newsletterAction, { method: 'POST', mode: 'no-cors', body: fd });
      } else {
        // Fallback: email the new subscriber to the association's inbox.
        request = sendWeb3Forms({ subject: 'Nueva suscripción al boletín', from_name: 'Web Rescate desde Turquía', email: email, Idioma: lang });
      }
      request.then(function () {
        show(box, 'nlDone', true);
        show(box, 'nlNotDone', false);
      }).catch(function (err) {
        console.error(err);
        show(box, 'nlSendErr', true);
      }).then(function () { btn.disabled = false; });
    };
    btn.addEventListener('click', submit);
    input.addEventListener('input', function () { show(box, 'nlErr', false); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
  });

  // ---- Dog profile photo gallery ----
  var main = document.querySelector('[data-main-photo]');
  var thumbs = document.querySelectorAll('[data-thumb]');
  if (main && thumbs.length) {
    var active = document.querySelector('[data-thumb][aria-pressed="true"]');
    var activeColor = active ? getComputedStyle(active).borderTopColor : '#1F3B4D';
    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        main.src = btn.querySelector('img').src;
        thumbs.forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.style.borderColor = on ? activeColor : 'transparent';
        });
      });
    });
  }
})();
