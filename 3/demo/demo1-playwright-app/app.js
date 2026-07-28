document.addEventListener('DOMContentLoaded', () => {
    const runCheckBtn = document.getElementById('runCheckBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const emptyState = document.getElementById('emptyState');
    const statusGrid = document.getElementById('statusGrid');
    const incidentDetails = document.getElementById('incidentDetails');

    runCheckBtn.addEventListener('click', () => {
        // ボタンの状態を更新
        runCheckBtn.disabled = true;
        runCheckBtn.textContent = 'チェック実行中...';
        
        // 処理中をシミュレート
        setTimeout(() => {
            // UIを更新して結果を表示
            emptyState.classList.add('hidden');
            statusGrid.classList.remove('hidden');
            incidentDetails.classList.remove('hidden');
            
            // ボタンの状態を元に戻す
            runCheckBtn.textContent = '再チェック実行';
            runCheckBtn.disabled = false;
            downloadBtn.disabled = false;
        }, 1500);
    });

    downloadBtn.addEventListener('click', () => {
        alert('レポートのダウンロードを開始します。');
    });
});
