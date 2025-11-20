// 定义4个API的前缀
const APIS = {
  api1: 'https://jx.xmflv.com/?url=',
  api2: 'https://jx.2s0.cn/player/?url=',
  api3: 'https://jx.77flv.cc/?url=',
  api4: 'http://jiexi42.qmbo.cn/jiexi/?url=',
  api5: 'http://www.jzmhtt.com/zdy/vip/?url=',
  api6: 'https://jx.playerjy.com/?url='
};

// 获取DOM元素
const currentUrlEl = document.getElementById('currentUrl');
const apiRadios = document.querySelectorAll('input[name="api"]');
const openBtn = document.getElementById('openBtn');
const statusEl = document.getElementById('status');

/**
 * 初始化：获取当前标签页的URL
 */
async function initCurrentUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url) {
      currentUrlEl.textContent = tab.url;
      return tab.url;
    }
    throw new Error('无法获取当前页面URL');
  } catch (err) {
    currentUrlEl.textContent = '获取URL失败';
    showStatus(err.message, 'error');
    return null;
  }
}

/**
 * 显示操作状态（成功/失败）
 * @param {string} message - 提示信息
 * @param {'success'|'error'} type - 状态类型
 */
function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = 'block';
  // 3秒后自动隐藏
  setTimeout(() => statusEl.style.display = 'none', 3000);
}

/**
 * 打开拼接后的链接
 */
async function open拼接Link() {
  const currentUrl = await initCurrentUrl();
  if (!currentUrl) return;

  // 获取选中的API
  const selectedApi = document.querySelector('input[name="api"]:checked').value;
  const fullUrl = `${APIS[selectedApi]}${encodeURIComponent(currentUrl)}`; // 编码当前URL

  try {
    await chrome.tabs.create({ url: fullUrl }); // 打开新标签
    showStatus('已在新标签打开拼接链接', 'success');
  } catch (err) {
    showStatus('打开链接失败，请重试', 'error');
  }
}

// 绑定按钮点击事件
openBtn.addEventListener('click', open拼接Link);

// 页面加载时初始化当前URL
initCurrentUrl();