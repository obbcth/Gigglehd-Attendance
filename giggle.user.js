// ==UserScript==
// @name         Gigglehd 출석체크
// @namespace    http://github.com/obbcth
// @version      0.1
// @description  Gigglehd 출석체크 (Thanks to 깍지님: https://gigglehd.com/gg/bbs/7138215)
// @author       Me
// @homepageURL  https://github.com/obbcth/Gigglehd-Attendance
// @downloadURL  https://raw.githubusercontent.com/obbcth/Gigglehd-Attendance/master/giggle.user.js
// @match        https://gigglehd.com/gg/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const messages = [
  "야 꿀벌. 왜 출석체크 하지 않은 거야?",
  "출석체크를 아직 하지 않으셨네요.",
  "어서 출석체크를 해주세요.",
  "출석체크할 때까지 괴롭힙니다.",
  "이봐 친구 출석체크는 두블럭 아래라고",
  "두 유 노우 출석?",
];

const getStatus = async () => {
  const result = await fetch("https://gigglehd.com/gg/attendance");
  const resultHtml = await result.text();
  const attendanceStatusHeaderIndex = resultHtml.indexOf("<th>출석여부</th>");
  const attendanceStatusStartIndex =
    resultHtml.indexOf(
      ">",
      resultHtml.indexOf(`<span class="label`, attendanceStatusHeaderIndex)
    ) + 1;
  const attendanceStatusEndIndex = resultHtml.indexOf(
    "</span>",
    attendanceStatusStartIndex
  );
  const attendanceStatusText = resultHtml
    .substring(attendanceStatusStartIndex, attendanceStatusEndIndex)
    .trim();
  return attendanceStatusText;
};

const getCookie = (cname) => {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const showToast = () => {
  const toast = document.getElementById("mc-at-toast");
  const text = document.getElementById("me-at-toast-text");
  text.innerText = messages[parseInt(Math.random() * messages.length, 10)];
  toast.style.transform = "translate(-50%, 36px)";
  toast.style.opacity = "1";
};

const hideToast = () => {
  const toast = document.getElementById("mc-at-toast");
  toast.style.transform = "translate(-50%, -100%)";
  toast.style.opacity = "0";
};

const main = async () => {
  if (window.location.pathname === "/attendance") {
    return;
  }
  const toast = document.createElement("div");
  toast.style.width = "auto";
  toast.style.height = "auto";
  toast.style.padding = "24px";
  toast.style.position = "fixed";
  toast.style.left = "50%";
  toast.style.top = "0px";
  toast.style.opacity = "0";
  toast.style.transform = "translate(-50%, -100%)";
  toast.style.transition = "all .5s cubic-bezier(0,1,0,1)";
  toast.style.zIndex = 50000;
  toast.style.border = "1px solid #d5dcde";
  toast.style.borderRadius = "4px";
  toast.style.textAlign = "center";
  if (getCookie("nightmode") === "true") {
    toast.style.backgroundColor = "#222222";
    toast.style.color = "#e0e0e0";
  } else {
    toast.style.backgroundColor = "#f1f4f4";
    toast.style.color = "#43494c";
  }
  toast.id = "mc-at-toast";
  toast.innerHTML = `
  <div id="mc-at-toast-close" style="position: absolute; right: 4px; top: 4px; padding: 4px; cursor: pointer;">X</div>
  <span id="me-at-toast-text"></span>
  <br />
  <br />
  <a href="/gg/attendance" style="color: #0000aa">
    출석하러 가기
  </a>`;
  window.document.body.appendChild(toast);
  const closeButton = window.document.getElementById("mc-at-toast-close");
  closeButton.addEventListener("click", hideToast);

  const status = await getStatus();
  if (status === "출첵안함") {
    showToast();
  }
};

main();

})();
