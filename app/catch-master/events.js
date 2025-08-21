export function handleFullscreenChange(gameOver,router) {
    const isFullscreen = !!document.fullscreenElement;
    if (!isFullscreen){ 
        gameOver.current=true;
        router.back();
    }
};

export const handleKeyDown = (e,keys) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
};

export const handleKeyUp = (e,keys) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
};