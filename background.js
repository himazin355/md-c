// 初回起動時にコンテキストメニューを作成するイベントハンドラの登録
chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

// コンテキストメニュークリック時に画像、リンクをMarkdown形式でコピーするイベントハンドラの登録
chrome.contextMenus.onClicked.addListener(copyByContextMenu);

// ブラウザアイコンクリック時にページリンクをMarkdown形式でコピーするイベントハンドラの登録
chrome.browserAction.onClicked.addListener(copyByBrowserAction);

/**
 * コンテキストメニューを作成する関数
 */
function createContextMenu() {
    chrome.contextMenus.create({
        id: 'mdCopy',
        title: 'Markdown形式でコピー',
        contexts: ['link', 'image'],
    });
}

/**
 * コンテキストメニューで、画像、リンクをMarkdown形式に変換してコピーする関数
 *
 * @param object info
 */
function copyByContextMenu(info) {
    let mediaType = info.mediaType;
    let srcUrl = info.srcUrl;
    let linkUrl = info.linkUrl;
    let selectionText = info.selectionText;
    let isSelectedText = typeof selectionText !== 'undefined';
    let ta = document.createElement('textarea');
    // コンテキストメニューを出した場所が画像の場合、画像を表示するMD形式の文字列を作成
    if (mediaType === 'image') {
        ta.value = '![altテキスト](' + srcUrl + ')';
    // コンテキストメニューを出した場所がリンクの場合、リンクを表示するMD形式の文字列を作成
    } else if (typeof linkUrl !== 'undefined') {
        if (isSelectedText) {
            ta.value = '[' + selectionText + '](' + linkUrl + ')';
        } else {
            ta.value = '[' + linkUrl + '](' + linkUrl + ')';
        }
    }
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

/**
 * ブラウザアイコンで、画像、リンクをMarkdown形式に変換してコピーする関数
 *
 * @param object info
 */
function copyByBrowserAction(tab) {
    let ta = document.createElement('textarea');
    ta.value = '[' + tab.title + '](' + tab.url + ')';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
} 
