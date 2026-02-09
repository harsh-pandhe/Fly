// Cursor FX
(function () {
  var CursorFx = function (opts) {
    this.target = opts.target;
    this.objects = opts.objects;
    this.animating = false;
    this.animatingId = false;
    this.rotateValue = [];
    initCursorFx(this);
  };

  function initCursorFx(element) {
    element.target.addEventListener('mousemove', function (event) {
      if (element.animating) return;
      element.animating = true;
      element.animatingId = window.requestAnimationFrame(moveObjs.bind(element, event));
    });

    element.target.addEventListener('mouseleave', function () {
      if (element.animatingId) {
        window.cancelAnimationFrame(element.animatingId);
        element.animatingId = false;
        element.animating = false;
      }
      resetObjs(element);
    });
  }

  function moveObjs(event) {
    this.targetInfo = this.target.getBoundingClientRect();
    for (var i = 0; i < this.objects.length; i++) {
      if (!this.rotateValue[i]) this.rotateValue[i] = false;
      moveSingleObj(this, this.objects[i], event, i);
    }
    this.animating = false;
  }

  function moveSingleObj(element, objDetails, event) {
    var effect = 'parallax';
    if (objDetails.effect) effect = objDetails.effect;

    if (effect === 'parallax') {
      moveObjParallax(element, objDetails, event);
    } else if (effect === 'follow') {
      moveObjFollow(element, objDetails, event);
    }
  }

  function moveObjParallax(element, objDetails, event) {
    var deltaTranslate = parseInt(objDetails.delta, 10);
    var translateX = (2 * deltaTranslate / element.targetInfo.width) * (element.targetInfo.left + element.targetInfo.width / 2 - event.clientX);
    var translateY = (2 * deltaTranslate / element.targetInfo.height) * (element.targetInfo.top + element.targetInfo.height / 2 - event.clientY);
    if (objDetails.direction && objDetails.direction === 'follow') {
      translateX = -1 * translateX;
      translateY = -1 * translateY;
    }
    objDetails.element.style.transform = 'translateX(' + translateX + 'px) translateY(' + translateY + 'px)';
  }

  function moveObjFollow(element, objDetails, event) {
    var objInfo = objDetails.element.getBoundingClientRect();
    objDetails.element.style.transform = 'translateX(' + parseInt(event.clientX - objInfo.width / 2, 10) + 'px) translateY(' + parseInt(event.clientY - objInfo.height / 2, 10) + 'px)';
  }

  function resetObjs(element) {
    for (var i = 0; i < element.objects.length; i++) {
      resetSingleObj(element, element.objects[i]);
    }
  }

  function resetSingleObj(element, objDetails) {
    objDetails.element.style.transform = '';
  }

  var cursorFxTarget = document.getElementsByClassName('js-cursor-fx-target');
  if (cursorFxTarget.length > 0) {
    var obj1 = document.getElementsByClassName('js-cursor-fx-object--1');
    var obj2 = document.getElementsByClassName('js-cursor-fx-object--2');
    var objects = [];
    if (obj1.length > 0) objects.push({ element: obj1[0], effect: 'parallax', delta: '40' });
    if (obj2.length > 0) objects.push({ element: obj2[0], effect: 'parallax', delta: '60', direction: 'follow' });
    new CursorFx({ target: cursorFxTarget[0], objects: objects });
  }
})();

// Modal Logic
function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  var modals = document.querySelectorAll('.modal-backdrop');
  modals.forEach(function (modal) {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeAllModals();
  }
});
