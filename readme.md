Exquis
======

le projet "Exquis" consiste à afficher sur une page web des cases contenant des animations javascript qui réagissent aux animations voisines. Le dispositif devrait permettre d'assembler sans trop de peine des animations créées par des auteurs différents.

Ce projet est réalisé dans le cadre du [gongfu.io](http://gongfu.io/)


session 12 juillet 2012:
------------------------

exploration de l'api canvas:

2 canvas utilisés pour cette session. 
Le premier, CanvasLeft, génére un motif animé.
Le second, CanvasRight, reçoit les pixels de la première ligne du CanvasLeft, et produit
sa propre représentation avec cette information.


session 19 juillet 2012:
------------------------

modularisation de l'entité animation. 
Exploration des différents patterns de création d'objets.
session à 3 (Olivier en guest star).


session 26 juillet 2012:
------------------------

objectifs: faire fonctionner la page de cases avec le nouvel objet.
introduire un objet "dashboard".

réalisation: 
session à 3 (Thanks Olivier)
simplifier l'objet animation
création d'une grille de 2 x 2 canevas
communication simple des bordures entre les canevas.


session 2 aout 2012:
--------------------

grille de 3 x 3 canevas.

système d'enchaînement d'animations

discussion sécurité du context d'évaluation. (voir solution iframe cf jsfiddle)


session 9 aout 2012:
-------------------

structure de données pour les animations.
généralisation du système de communication des bordures.


session 16 aout 2012:
---------------------

comprendre le très joli bug pour le reproduire délibérement.

pourquoi TR  copie t'il le bord nord au lieu du bord ouest ?


session 23 aout 2012:
---------------------

implémentation du live coding pour la case du milieu.

bug sur la mise à jour de la fonction draw, quand la string est incorrecte.


session 30 aout 2012:
---------------------

correction du bug du 23.
visualisation de la validité du code.
refactor du mécanisme de mise à jour du code évalué.


session 6 septembre 2012:
-------------------------

live coding pour toutes les cellules.






