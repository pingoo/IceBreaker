// MenuScreenContext est un objet statique qui sert de contexte au menu

// Pas de constructeur, attribution des champs statiques
MenuScreenContext = {
    startGameText : null,
    background : null,
    
    loadNextScreen : false,
    timer : null,
    
    blink : 1,
    currentInterval : 0,
    maxInterval : 32,
};
