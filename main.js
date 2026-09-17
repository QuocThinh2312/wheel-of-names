const initialNames = [
  'Nguyễn Hồng Anh',
  'Huỳnh Hữu Hiền',
  'Lê Tuấn Huy Hoàng',
  'Lại Hoàng Minh Huy',
  'Vũ Hoàng Đăng Khôi',
  'Nguyễn Chánh Hùng Mạnh',
  'Võ Hứa Hoàng Oanh',
  'Nguyễn Huy Hoàng',
  'Nguyễn Tuấn Kiệt',
  'Nguyễn Đậu Thư Kỳ',
  'Nguyễn Hoàng Phi',
  'Vũ Trung Toàn',
  'Đoàn Thế Tôn',
  'Lê Ngọc Vinh',
  'Hoàng Thị Hồng Mơ',
  'Trần Yến Nhi',
  'Châu Thị Kiều Oanh',
  'Nguyễn Hoàng Thái',
  'Nguyễn Quốc Thịnh',
  'Lê Think',
  'Lê Ngọc Bảo Trân',
  'Đặng Gia Bảo',
  'Huỳnh Nguyên Danh',
  'Nguyễn Thị Mỹ Huyền',
  'Nguyễn Quý Duy Khoa',
  'Huỳnh Tuấn Kiệt',
  'Đặng Phước Nhân',
  'Nguyễn Hoàng Triệu',
  'Phạm Cường Vinh',
  'Nguyễn Hoàng Dũng',
  'Cao Tấn Huy',
  'Lê Tuấn Kiệt',
  'Nguyễn Tấn Kiệt',
  'Nguyễn Hà Hoàng Phú',
  'Nguyễn Quốc Quân',
  'Lê Đức Toàn',
  'Lê Thành Đạt',
  'Vũ Thành Đức',
  'Huỳnh Văn Thiên Lân',
  'Trần Anh Minh Quân',
  'Bùi Anh Quyết',
  'Phùng Duy Thịnh',
  'Tô Triệu Vỹ',
  'Nguyễn Trọng Đức',
  'Đào Phước Quốc Kha',
  'Huỳnh Minh Khang',
  'Lê Đình Khiêm',
  'Nguyễn Trí Nhân',
  'Nguyễn Minh Nhật',
  'Lộc Cẩm Vinh',
  'Phan Thành Đạt',
  'Đoàn Huy Hoàng',
  'Trần Minh Khang',
  'Võ Huỳnh Tấn Kiệt',
  'Phan Kỳ Nam',
  'Trương Thanh Phong',
  'Tô Minh Phúc',
  'Lê Thanh Phú Quý',
  'Đại Chí Thành',
  'Phan Văn Hoàng Thông',
  'Nguyễn Minh Trí',
  'Đặng Minh Trung',
  'Nguyễn Hữu Ý',
];
const savedTargets = localStorage.getItem('secretTargets');
let TARGET_WINNERS = savedTargets ? JSON.parse(savedTargets) : ['Trần Yến Nhi', 'Lê Ngọc Bảo Trân', 'Nguyễn Hoàng Thái'];
const colors = ['#fbbc05', '#ea4335', '#4285f4', '#34a853'];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const namesInput = document.getElementById('namesInput');
const spinBtn = document.getElementById('spinBtn');
const winnerModal = document.getElementById('winnerModal');
const modalContent = document.getElementById('modalContent');
const winnerNameDisplay = document.getElementById('winnerName');
const closeBtn = document.getElementById('closeBtn');
const removeBtn = document.getElementById('removeBtn');

const secretTrigger = document.getElementById('secretTrigger');
const secretModal = document.getElementById('secretModal');
const secretInput = document.getElementById('secretInput');
const saveSecretBtn = document.getElementById('saveSecretBtn');
const closeSecretBtn = document.getElementById('closeSecretBtn');

let names = [...initialNames];
let spinCount = 0;
let currentRotation = 0;
let isSpinning = false;
let currentWinnerIndex = -1;
let secretClickCount = 0;
let secretClickTimer;

const init = () => {
  namesInput.value = names.join('\n');
  drawWheel();
};

const drawWheel = () => {
  const numSlices = names.length || 1;
  const sliceAngle = (2 * Math.PI) / numSlices;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = centerX;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSlices; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(i * sliceAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const displayText = names.length ? names[i] : 'Empty';
    const maxTextLength = radius * 0.5;
    const innerRadiusText = radius - maxTextLength;
    const maxSafeFontSize = innerRadiusText * sliceAngle * 0.95;
    const fontSize = Math.max(14, Math.min(28, maxSafeFontSize));

    ctx.font = `bold ${fontSize}px 'Arial Narrow', Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 4;

    const textWidth = ctx.measureText(displayText).width;
    let xPos = radius - 15;

    if (textWidth > maxTextLength) {
      const scaleRatio = maxTextLength / textWidth;
      ctx.scale(scaleRatio, 1);
      xPos = xPos / scaleRatio;
    }

    ctx.fillText(displayText, xPos, 0);
    ctx.restore();
  }
};

const triggerFireworks = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: colors, zIndex: 9999 });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: colors, zIndex: 9999 });

    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

const openModal = (winnerName) => {
  winnerNameDisplay.textContent = winnerName;
  winnerModal.classList.remove('hidden');
  winnerModal.classList.add('animate-fade-in');
  modalContent.classList.add('animate-pop-in');
  triggerFireworks();
};

const closeModal = () => {
  winnerModal.classList.add('hidden');
  winnerModal.classList.remove('animate-fade-in');
  modalContent.classList.remove('animate-pop-in');
};

namesInput.addEventListener('input', (e) => {
  names = e.target.value
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean);
  drawWheel();
});

spinBtn.addEventListener('click', () => {
  if (isSpinning || names.length === 0) return;
  isSpinning = true;

  let targetIndex = -1;

  if (spinCount < TARGET_WINNERS.length) {
    targetIndex = names.indexOf(TARGET_WINNERS[spinCount]);
  }

  if (targetIndex === -1) {
    targetIndex = Math.floor(Math.random() * names.length);
  }

  currentWinnerIndex = targetIndex;

  const sliceAngle = 360 / names.length;
  const sliceCenterAngle = targetIndex * sliceAngle + sliceAngle / 2;
  const baseTargetAngle = 360 - sliceCenterAngle;
  const randomJitter = (Math.random() - 0.5) * (sliceAngle * 0.7);
  const extraSpins = (8 + Math.floor(Math.random() * 4)) * 360;
  const currentFullRotations = Math.floor(currentRotation / 360) * 360;
  const targetRotation = currentFullRotations + extraSpins + baseTargetAngle + randomJitter;
  const spinDuration = 6;

  canvas.style.transition = `transform ${spinDuration}s cubic-bezier(0.2, 0.9, 0.1, 1)`;
  canvas.style.transform = `rotate(${targetRotation}deg)`;

  currentRotation = targetRotation;
  spinCount++;

  setTimeout(() => {
    isSpinning = false;
    openModal(names[currentWinnerIndex]);
  }, spinDuration * 1000);
});

closeBtn.addEventListener('click', closeModal);

removeBtn.addEventListener('click', () => {
  if (currentWinnerIndex !== -1) {
    names.splice(currentWinnerIndex, 1);
    namesInput.value = names.join('\n');
    drawWheel();
  }
  closeModal();
});

secretTrigger.addEventListener('click', () => {
  secretClickCount++;
  clearTimeout(secretClickTimer);

  if (secretClickCount === 3) {
    secretInput.value = TARGET_WINNERS.join('\n');
    secretModal.classList.remove('hidden');
    secretClickCount = 0;
  } else {
    secretClickTimer = setTimeout(() => {
      secretClickCount = 0;
    }, 500);
  }
});

closeSecretBtn.addEventListener('click', () => {
  secretModal.classList.add('hidden');
});

saveSecretBtn.addEventListener('click', () => {
  TARGET_WINNERS = secretInput.value
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean);
  localStorage.setItem('secretTargets', JSON.stringify(TARGET_WINNERS));
  spinCount = 0;
  secretModal.classList.add('hidden');
});

init();
