# GitHub Copilot — Guide d'adoption équipe

**Espace Confluence :** GenAI / Fintech — Outils de développement  
**Auteur :** Équipe Plateforme Dev / DevOps  
**Statut :** Publié  
**Dernière mise à jour :** 09 novembre 2026  
**Format :** Documentation destinée à l'import dans Atlassian Confluence (Wiki)

---

## 📑 Sommaire

1. [Introduction et objet](#introduction-et-objet)
2. [Comment importer les diagrammes Excalidraw dans Confluence](#comment-importer-les-diagrammes-excalidraw-dans-confluence)
3. [00 — Prise en main « Que voit-il, que fait-il sans me demander ? »](#00---prise-en-main-que-voit-il-que-fait-il-sans-me-demander)
4. [01 — Commandes natives « Je ne sais ni l’arrêter, ni annuler, ni voir ce qu’il a en tête »](#01---commandes-natives-je-ne-sais-ni-larrter-ni-annuler-ni-voir-ce-quil-a-en-tte)
5. [02 — Contexte & mémoire « Il ignore nos conventions à chaque session »](#02---contexte--mémoire-il-ignore-nos-conventions-à-chaque-session)
6. [03 — Commandes personnalisées « Je retape le même prompt de revue tous les jours »](#03---commandes-personnalisées-je-retape-le-même-prompt-de-revue-tous-les-jours)
7. [04 — Hooks « Ma commande dit de ne pas committer de secret ; rien ne l’empêche »](#04---hooks-ma-commande-dit-de-ne-pas-committer-de-secret-rien-ne-lempêche)
8. [05 — Skills « Un hook sait dire non, pas faire une procédure »](#05---skills-un-hook-sait-dire-non-pas-faire-une-procédure)
9. [06 — Plugins « Douze collègues, huit dépôts — et je réinvente ce qui existe »](#06---plugins-douze-collègues-huit-dépôts---et-je-réinvente-ce-qui-existe)
10. [07 — Sous-agents « La revue sature ma session et valide par complaisance »](#07---sous-agents-la-revue-sature-ma-session-et-valide-par-complaisance)
11. [08 — MCP « Il ne voit ni la base, ni le navigateur, ni les traces »](#08---mcp-il-ne-voit-ni-la-base-ni-le-navigateur-ni-les-traces)
12. [Annexe — L'agent sans terminal (headless, CI)](#annexe---lagent-sans-terminal-headless-ci)
13. [Référence rapide des commandes GitHub Copilot](#référence-rapide-des-commandes-github-copilot)
14. [Glossaire](#glossaire)
15. [Sécurité et conformité (RGPD / secrets)](#sécurité-et-conformité-rgpd--secrets)

---

## Introduction et objet

Ce document a pour objet d'accompagner l'adoption de **GitHub Copilot** au sein des équipes de développement et DevOps de l'organisation. Il est structuré en neuf modules (00 à 08), chacun répondant à une limite concrète exprimée par les utilisateurs, et présentant la brique GitHub Copilot qui la lève.

Chaque module suit le même canevas :

* **La limite** — le problème ou la crainte exprimée par un utilisateur.
* **Cas d'usage** — exemples concrets (développement et DevOps).
* **La brique qui lève cette limite** — la fonctionnalité GitHub Copilot correspondante.
* **Diagramme** — schéma Excalidraw (fichier `.excalidraw` associé, importable dans Excalidraw).
* **Comment faire** — procédure opérationnelle.
* **Bonnes pratiques** — règles d'usage et garde-fous.

> **Principe fondateur :** GitHub Copilot lit le contexte et suggère du code ; il n'exécute jamais une commande ou un outil sans ton accord explicite (boîte de permission). C'est ton dernier rempart.

### Le fil conducteur en un coup d'œil

![Fil conducteur — les 9 briques GitHub Copilot](./diagrams/09-fil-conducteur.excalidraw)

*Lecture :* **00 voit** → **01 cadre** → **02 souviens-toi** → **03 rejoue** → **04 impose** → **05 sais-faire** → **06 partage** → **07 délègue** → **08 vois**. Chaque brique lève une limite ; aucune ne remplace la boîte de permission.

---

## Comment importer les diagrammes Excalidraw dans Confluence

Les neuf modules sont illustrés par un diagramme dédié, complété par un diagramme de synthèse (fil conducteur). Les fichiers sont fournis au format Excalidraw (`.excalidraw`, dossier `diagrams/`).

1. Ouvrir [excalidraw.com](https://excalidraw.com).
2. Clic sur le menu hamburger (≡) → **Importer** → sélectionner le fichier `.excalidraw` concerné.
3. Exporter en **SVG** (ou PNG) pour insertion dans Confluence, ou utiliser l'application **Excalidraw pour Confluence** si elle est installée sur votre instance Atlassian.

| Module | Fichier Excalidraw | Objet du diagramme |
|--------|-------------------|--------------------|
| 00 | `diagrams/00-prise-en-main.excalidraw` | Ce que Copilot voit / fait sans demander + boîte de permission |
| 01 | `diagrams/01-commandes-natives.excalidraw` | Modèle vs harnais, commandes natives `/plan`, `/rewind`, `/context` |
| 02 | `diagrams/02-contexte-memoire.excalidraw` | Mémoire partagée entre sessions via Copilot instructions |
| 03 | `diagrams/03-commandes-personnalisees.excalidraw` | Prompt enregistré réutilisable = commande personnalisée |
| 04 | `diagrams/04-hooks.excalidraw` | Hook garde-fou : bloquer un commit contenant un secret |
| 05 | `diagrams/05-skills.excalidraw` | Skill = savoir-faire exécutable, complète le hook |
| 06 | `diagrams/06-plugins.excalidraw` | Plugin partagé : 12 collègues, 8 dépôts, ne plus réinventer |
| 07 | `diagrams/07-sous-agents.excalidraw` | Sous-agents spécialisés pour éviter la saturation et la complaisance |
| 08 | `diagrams/08-mcp.excalidraw` | MCP : connecter Copilot à la base, le navigateur, les traces |
| Synthèse | `diagrams/09-fil-conducteur.excalidraw` | Parcours des 9 briques : voir → cadrer → mémoriser → rejouer → imposer → savoir-faire → partager → déléguer → voir |

---

<a id="introduction-et-objet"></a>

## 00 — Prise en main « Que voit-il, que fait-il sans me demander ? »

### La limite
> **« Que voit-il, que peut-il faire, que fera-t-il sans me demander ? »**

Avant d'activer Copilot sur un dépôt qui compte, il faut comprendre trois choses : **le modèle**, **les outils**, **la boucle** — et la **boîte de permission**, ton dernier rempart.

### Cas d'usage

| Contexte | Question utilisateur |
|----------|---------------------|
| **Développement** | « Explique-moi comment Ordering valide un produit. » Va-t-il lire le code, ou inventer une réponse plausible ? |
| **DevOps** | « Lance le build. » Va-t-il exécuter une commande sur ma machine ? Avec quels droits ? |

### Ce que Copilot voit sans te demander
* Les fichiers ouverts et les onglets actifs de l'IDE.
* La sélection courante et la position du curseur.
* Les **Copilot instructions** (`.github/copilot-instructions.md`, `COPILOT.md` à la racine).
* L'historique de la session de chat en cours.

### Ce que Copilot fait sans te demander
* La **complétion en ligne** (ghost text) pendant que tu tapes.
* Des **propositions de code** dans le chat.
* Des **réponses de lecture seule** à tes questions.

> Il ne **lance pas** de commande, ne **modifie pas** de fichier et ne **commite** rien sans ton accord dans la boîte de permission.

### Diagramme
![Diagramme 00 — Prise en main](./diagrams/00-prise-en-main.excalidraw)

### Comment faire
1. Installer l'extension **GitHub Copilot** dans l'IDE (VS Code, JetBrains Rider, etc.).
2. Se connecter avec son compte GitHub (pro ou organisation).
3. Ouvrir un dépôt : le répertoire de travail devient la frontière par défaut de ce que Copilot voit.
4. Vérifier la connectivité : dans le chat Copilot, poser une question simple sur le code ouvert.
5. **Toujours lire la boîte de permission** avant de valider l'exécution d'un outil ou d'une commande.

### Bonnes pratiques
* Ne jamais lancer Copilot sur un dépôt sensible avant d'avoir vérifié ce qu'il voit (fichiers exposés, secrets, données personnelles).
* Préférer les surfaces de l'éditeur (diffs, sélection en contexte) pour le travail précis ; utiliser le terminal pour la référence et le headless/CI.
* Traiter chaque suggestion comme une proposition à relire, jamais comme une vérité.

### Garde-fous
* La boîte de permission est obligatoire avant toute exécution d'outil ou commande shell.
* Aucun secret ne doit jamais être présent dans les fichiers exposés à Copilot (voir module 04).

---

<a id="01---commandes-natives"></a>

## 01 — Commandes natives « Je ne sais ni l’arrêter, ni annuler, ni voir ce qu’il a en tête »

### La limite
> **« Je ne sais ni l’arrêter, ni annuler, ni voir ce qu’il a en tête. »**

Cas d'usage : tu demandes d'ajouter la pagination au catalogue ; il touche l'endpoint, le client web, la page… le refactoring dérape. Comment revenir exactement à l'état d'avant ? Ou encore : il veut modifier `docker-compose.yml` ; comment lire ce qu'il va faire avant d'autoriser ?

### La brique qui lève cette limite
Les **commandes natives** sont exécutées par le **harnais Copilot** (déterministe), pas interprétées par le modèle (probabiliste).

* `/plan` — voir ce qu'il compte faire **avant** d'agir.
* `/rewind` — revenir à un checkpoint (code, conversation, ou les deux).
* `/context` — voir ce qu'il a en tête (fenêtre de contexte, source par source).
* `/usage`, `/tasks` — coût, limites, et ce qui tourne en arrière-plan.
* `/code-review`, `/security-review`, `/permissions` — qualité et sécurité.

### Le harnais, pas le modèle

| Modèle (probabiliste) | Harnais Copilot (déterministe) |
|-----------------------|--------------------------------|
| Interprète, propose | Exécute, cadre |
| Génère du code | Gère `/init`, `/plan`, `/goal`, `/effort` |
| Peut déraper | `/rewind` pour reprendre la main |

### Diagramme
![Diagramme 01 — Commandes natives](./diagrams/01-commandes-natives.excalidraw)

### Comment faire
1. **Cadrer** avant d'agir : `/init` pour générer le `COPILOT.md`, `/plan` pour voir le plan d'action, `/goal` pour fixer l'objectif.
2. Laisser l'agent **explorer, proposer, attendre ton accord**.
3. En cas de dérive : utiliser **`/rewind`** pour revenir au checkpoint précédent.
4. Pour vérifier ce qu'il a en tête : **`/context`**.
5. Pour libérer du contexte : **`/compact`** (résume) ou **`/clear`** (reparte à vide, le `COPILOT.md` reste).

> **Limite de `/rewind` :** il restaure les fichiers édités par l'agent, mais pas les effets d'une commande shell (migration appliquée, image construite). Pour ceux-ci : Git et les garde-fous.

### Bonnes pratiques
* Toujours lancer `/plan` avant une modification impactante.
* Valider chaque boîte de permission individuellement ; ne pas cocher « toujours autoriser » à la légère.
* Conserver un historique Git propre : commiter avant une session Copilot importante.

---

<a id="02---contexte--mémoire-il-ignore-nos-conventions-à-chaque-session"></a>

## 02 — Contexte & mémoire « Il ignore nos conventions à chaque session »

### La limite
> **« Chaque session repart de zéro : il ignore nos conventions. »**

Cas d'usage :
* Il écrit `new Uri("http://localhost:5147")` au lieu du service discovery `https+http://catalog`.
* Il logue `order.Customer` : une donnée personnelle dans la télémétrie (RGPD).
* Il lance `dotnet build` à la racine au lieu de `dotnet build ECommerce.slnx` : une CI différente du poste.
* Il crée la branche `feature-pagination` au lieu de `feat/`.

### La brique qui lève cette limite
Les **Copilot instructions** — une mémoire versionnée, relue à chaque session, par toute l'équipe.

* `.github/copilot-instructions.md` — conventions partagées de l'organisation/dépôt.
* `COPILOT.md` à la racine du repo — mémoire spécifique au dépôt.

> Il n'a pas oublié vos conventions : **il ne les a jamais sues**. Tant qu'elles ne sont pas dans un fichier de instructions versionné, Copilot ne les connaît pas.

### Diagramme
![Diagramme 02 — Contexte & mémoire](./diagrams/02-contexte-memoire.excalidraw)

### Comment faire
1. Créer `.github/copilot-instructions.md` à la racine du dépôt (ou organisation-wide).
2. Y consigner : conventions de nommage, chemins de build, règles de branche (`feat/`), règles de journalisation (pas de données personnelles), critères d'acceptation.
3. Committer ce fichier : il est relu automatiquement au démarrage de chaque session.
4. Pour le contexte ponctuel d'une session, utiliser `@fichier` ou `#note` dans le chat.
5. Réviser les instructions en équipe à chaque sprint (mémoire vivante).

### Bonnes pratiques
* Une seule source de vérité : le fichier d'instructions, pas la mémoire individuelle.
* Tester les instructions : ouvrir une nouvelle session et vérifier que Copilot applique les conventions.
* Ne pas mettre de secrets dans les instructions (elles sont versionnées et lues par tous).

---

<a id="03---commandes-personnalisées-je-retape-le-même-prompt-de-revue-tous-les-jours"></a>

## 03 — Commandes personnalisées « Je retape le même prompt de revue tous les jours »

### La limite
> **« Je retape le même prompt de revue tous les jours. »**

### La brique qui lève cette limite
Les **commandes personnalisées** : un prompt enregistré, versionné, réutilisable par toute l'équipe, déclenchable en un clic ou raccourci.

### Diagramme
![Diagramme 03 — Commandes personnalisées](./diagrams/03-commandes-personnalisees.excalidraw)

### Comment faire
1. Rédiger le prompt type de revue (checklist : bugs, simplifications, sécurité, tests, conventions).
2. L'enregistrer comme commande personnalisée via les instructions de chat ou `.github/copilot-instructions.md`.
3. Déclencher avec `@fichier #note /commande-personnalisée`.
4. Partager la commande avec l'équipe (dépôt commun ou plugin, module 06).

### Exemple de contenu d'une commande de revue
```
Rôle : réviseur de code senior.
Contexte : dépôt E-Commerce, conventions dans .github/copilot-instructions.md.
Tâche : reviewer le diff suivant.
Checklist :
- [ ] Pas de données personnelles dans les logs (RGPD)
- [ ] Pas de secrets en dur (clés, tokens)
- [ ] Build : dotnet build ECommerce.slnx à la racine
- [ ] Branche nommage feat/*
- [ ] Tests d'intégration pour tout nouvel endpoint
Sortie : liste des corrections requises + validation si conforme.
```

### Bonnes pratiques
* Une commande par usage récurrent (revue, migration, génération de tests, build).
* Versionner les commandes avec le code.
* Former l'équipe à les déclencher plutôt qu'à retaper les prompts.

---

<a id="04---hooks-ma-commande-dit-de-ne-pas-committer-de-secret-rien-ne-lempêche"></a>

## 04 — Hooks « Ma commande dit de ne pas committer de secret ; rien ne l'empêche »

### La limite
> **« Ma commande dit de ne pas committer de secret ; rien ne l'empêche. »**

### La brique qui lève cette limite
Les **hooks** (garde-fous) : pré-commit / pre-push qui scannent les changements et autorisent ou refusent l'opération.

* Hook pré-commit : scan des secrets (clés, tokens, mots de passe) avant le commit.
* Si secret détecté → **commit bloqué**.

### Diagramme
![Diagramme 04 — Hooks](./diagrams/04-hooks.excalidraw)

### Comment faire
1. Configurer un hook pré-commit (ex. via `pre-commit`, `lefthook`, ou GitHub Copilot hooks selon l'IDE/plateforme).
2. Définir les règles de détection : patterns de clés API, tokens, mots de passe, variables sensibles.
3. Lier le hook au flux Git : `pre-commit` et `pre-push`.
4. Tester : tenter un commit avec un faux secret → doit être bloqué.

### Ce que le hook fait
* Scan automatique des fichiers modifiés.
* Refus ou autorisation du commit/push.

### Ce que le hook ne fait pas (limite importante)
* Il **dit « non »** ; il ne **fait pas** la procédure de correction à ta place.
* C'est à l'humain de retirer le secret et de le remplacer par une variable d'environnement.

### Bonnes pratiques
* Coupler le hook avec un scan de secrets côté dépôt (ex. GitHub Secret Scanning).
* Ne jamais committer de secret, même temporairement.
* Former l'équipe à la procédure de remédiation quand un hook refuse.

---

<a id="05---skills-un-hook-sait-dire-non-pas-faire-une-procédure"></a>

## 05 — Skills « Un hook sait dire non, pas faire une procédure »

### La limite
> **« Un hook sait dire non, pas faire une procédure. »**

### La brique qui lève cette limite
Les **Skills** : des savoir-faire exécutables — des procédures pas à pas que l'agent peut exécuter, au lieu de simplement interdire.

* Hook : refuse le commit avec secret.
* Skill : exécute la procédure de création d'une PR de revue, de migration, ou de correction.

### Diagramme
![Diagramme 05 — Skills](./diagrams/05-skills.excalidraw)

### Comment faire
1. Identifier une procédure répétitive (ex. « créer une PR de revue », « appliquer une correction de sécurité »).
2. La formaliser en skill : étapes, déclenchement, préconditions, résultat attendu.
3. Déclencher la skill via une commande personnalisée ou automatiquement par le contexte.
4. La skill s'exécute dans le cadre de la boîte de permission (accord requis).

### Différence hook vs skill
| Hook | Skill |
|------|-------|
| Dit « non » (blocage) | Fait (procédure exécutable) |
| Garde-fou de sécurité | Savoir-faire métier |
| Ex: bloquer un secret | Ex: créer une PR de revue |

### Bonnes pratiques
* Utiliser le hook pour ce qu'il faut interdire.
* Utiliser la skill pour ce qu'il faut faire de façon standardisée et répétable.
* Toujours valider dans la boîte de permission avant exécution d'une skill.

---

<a id="06---plugins-douze-collègues-huit-dépôts---et-je-réinvente-ce-qui-existe"></a>

## 06 — Plugins « Douze collègues, huit dépôts — et je réinvente ce qui existe »

### La limite
> **« Douze collègues, huit dépôts — et je réinvente ce qui existe. »**

Sans plugin, chaque collègue recrée ses prompts, ses revues, ses hooks sur chaque dépôt.

### La brique qui lève cette limite
Les **Plugins** : briques versionnées (commandes, skills, hooks) partagées dans l'organisation, installées une fois pour tous.

### Diagramme
![Diagramme 06 — Plugins](./diagrams/06-plugins.excalidraw)

### Comment faire
1. Identifier les briques communes à l'équipe : commande de revue, hook anti-secret, skill de migration, instructions de contexte.
2. Les packager en plugin versionné.
3. Publier le plugin dans l'organisation GitHub / Confluence pour qu'il soit installé une fois.
4. Chaque collègue sur chacun des 8 dépôts profite des mêmes commandes, skills et hooks.

### Sans plugin vs avec plugin
| Sans plugin | Avec plugin |
|-------------|-------------|
| Chaque collègue recrée ses prompts | Commandes partagées et versionnées |
| Chacun réinvente sa revue | Revue homogène pour tous |
| Hooks recopiés sur chaque dépôt | Hooks installés une fois |

### Bonnes pratiques
* Un plugin = une responsabilité, versionné.
* Documenter chaque plugin dans ce wiki.
* Valider les plugins par l'équipe avant déploiement organisationnel.

---

<a id="07---sous-agents-la-revue-sature-ma-session-et-valide-par-complaisance"></a>

## 07 — Sous-agents « La revue sature ma session et valide par complaisance »

### La limite
> **« La revue sature ma session et valide par complaisance. »**

Quand plusieurs dimensions de revue s'accumulent (fonctionnelle, sécurité, performance), la session principale sature et l'agent tend à valider par complaisance plutôt qu'à vraiment challenger le code.

### La brique qui lève cette limite
Les **sous-agents** : délégation de la revue à des agents spécialisés et isolés, chacun avec son propre contexte et sa propre vérification.

* Sous-agent A : revue fonctionnelle.
* Sous-agent B : revue sécurité.
* (Possiblement C : revue performance, D : revue tests.)

### Diagramme
![Diagramme 07 — Sous-agents](./diagrams/07-sous-agents.excalidraw)

### Comment faire
1. Décomposer la revue en domaines spécialisés.
2. Créer un sous-agent par domaine, avec ses propres instructions et contexte.
3. Déléguer : le sous-agent travaille en isolation, puis remonte son verdict.
4. L'agent principal synthétise les avis des sous-agents pour prendre la décision finale.

### Bonnes pratiques
* Ne pas tout reviewer dans la session principale.
* Isoler les sous-agents pour éviter la contamination de contexte.
* Exiger une justification explicite pour chaque validation (lutter contre la complaisance).
* Limiter le nombre de sous-agents simultanés pour éviter la saturation inverse.

---

<a id="08---mcp-il-ne-voit-ni-la-base-ni-le-navigateur-ni-les-traces"></a>

## 08 — MCP « Il ne voit ni la base, ni le navigateur, ni les traces »

### La limite
> **« Il ne voit ni la base, ni le navigateur, ni les traces. »**

Par défaut, Copilot ne connaît que le code du dépôt. Il est aveugle aux ressources externes : base de données, navigateur web, traces/logs d'exécution.

### La brique qui lève cette limite
**MCP (Model Context Protocol)** : un protocole qui permet à Copilot d'interroger des serveurs MCP connectés à des ressources externes.

### Diagramme
![Diagramme 08 — MCP](./diagrams/08-mcp.excalidraw)

### Comment faire
1. Identifier les ressources externes nécessaires : base de données, navigateur, traces/logs.
2. Déployer ou configurer des serveurs MCP pour chacune de ces ressources.
3. Connecter Copilot aux serveurs MCP via la configuration du client.
4. Copilot peut alors interroger la base, naviguer ou consulter les traces dans le cadre d'une session (sous réserve de la boîte de permission).

### Ressources accessibles via MCP
| Ressource | Exemple d'usage |
|-----------|----------------|
| Base de données | « Quel est le schéma de la table Ordering ? » |
| Navigateur web | « Vérifie le rendu de cette page en production. » |
| Traces / logs | « Pourquoi ce endpoint échoue en production ? » |

### Bonnes pratiques
* N'exposer via MCP que les ressources strictement nécessaires.
* Appliquer le moindre privilège sur les serveurs MCP (lecture seule quand possible).
* Garder la boîte de permission : MCP étend la vue, pas l'exécution sans accord.

---

## Annexe — L'agent sans terminal (headless, CI)

GitHub Copilot peut s'exécuter sans terminal interactif, en mode headless, notamment dans les pipelines CI.

* Même briques que le mode interactif (commandes, hooks, skills, plugins, MCP).
* Pas de boîte de permission interactive : la politique de sécurité doit être définie à l'avance (hooks, scans de secrets, approbations).
* Utiliser pour : revue automatique de PR, scans de sécurité, génération de documentation, migrations encadrées.

> L'agent sans terminal n'est pas une brique supplémentaire : c'est un mode d'exécution des mêmes briques, hors chaîne interactive.

---

## Référence rapide des commandes GitHub Copilot

| Commande | Rôle |
|----------|------|
| `/plan` | Voir le plan d'action avant d'agir |
| `/rewind` | Revenir à un checkpoint |
| `/context` | Voir ce que Copilot a en tête |
| `/usage` | Coût et limites de la session |
| `/tasks` | Ce qui tourne en arrière-plan |
| `/code-review` | Revue du diff (bugs, simplifications) |
| `/security-review` | Sécurité des changements avant chaque PR |
| `/permissions` | allow / ask / deny avant de le laisser seul |
| `/compact` | Résumer pour libérer du contexte |
| `/clear` | Repartir à vide (COPILOT.md conservé) |
| `@fichier` | Référencer un fichier dans le contexte |
| `#note` | Ajouter une note de contexte |

---

## Glossaire

| Terme | Définition |
|-------|------------|
| **Modèle** | L'IA probabiliste qui génère des suggestions et répond au chat. |
| **Harnais** | La couche déterministe qui exécute les commandes, outils et gère les permissions. |
| **Boîte de permission** | Dialogue de confirmation avant toute exécution d'outil ou commande. Ton dernier rempart. |
| **Copilot instructions** | Fichiers de mémoire (`.github/copilot-instructions.md`, `COPILOT.md`) lus à chaque session. |
| **Commande personnalisée** | Prompt enregistré, versionné, réutilisable par l'équipe. |
| **Hook** | Garde-fou (pré-commit / pre-push) qui autorise ou refuse une opération. |
| **Skill** | Savoir-faire exécutable : procédure pas à pas que l'agent peut lancer. |
| **Plugin** | Brique versionnée (commandes, skills, hooks) partagée dans l'organisation. |
| **Sous-agent** | Agent spécialisé et isolé auquel on délègue une partie de la revue. |
| **MCP** | Model Context Protocol : connecte Copilot à des ressources externes (base, navigateur, traces). |

---

## Sécurité et conformité (RGPD / secrets)

1. **Aucun secret en dur** : clés API, tokens et mots de passe ne doivent jamais apparaître dans le code, les instructions, ou les données exposées à Copilot.
2. **Aucune donnée personnelle dans les logs** : respecter le RGPD (ne pas logger `order.Customer` ou équivalent).
3. **Boîte de permission obligatoire** : aucune exécution d'outil ou commande sans accord explicite.
4. **Scan de secrets** : activer un hook pré-commit et/ou GitHub Secret Scanning sur chaque dépôt.
5. **Revue humaine** : chaque suggestion de Copilot est relue par un développeur avant merge.

---

> Ce document est maintenu par l'équipe Plateforme Dev / DevOps. Toute amélioration ou correction est la bienvenue via une Pull Request sur le dépôt de documentation.
