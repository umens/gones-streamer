'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gones-streamer documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' : 'data-target="#xs-components-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' :
                                            'id="xs-components-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShellComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShellComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' : 'data-target="#xs-injectables-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' :
                                        'id="xs-injectables-links-module-CoreModule-6a13f6283c113bfac0acb46bc306fb3d"' }>
                                        <li class="link">
                                            <a href="injectables/AuthGuardService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthGuardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthenticationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreRoutingModule.html" data-type="entity-link">CoreRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RemoteCenterModule.html" data-type="entity-link">RemoteCenterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' : 'data-target="#xs-components-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' :
                                            'id="xs-components-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' }>
                                            <li class="link">
                                                <a href="components/CockpitComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CockpitComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RemoteCenterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RemoteCenterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' : 'data-target="#xs-injectables-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' :
                                        'id="xs-injectables-links-module-RemoteCenterModule-62ab926f46024c6f1fafb7fd547960d9"' }>
                                        <li class="link">
                                            <a href="injectables/ObsWebsocketService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ObsWebsocketService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WebsocketService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WebsocketService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RemoteCenterRoutingModule.html" data-type="entity-link">RemoteCenterRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' : 'data-target="#xs-injectables-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' :
                                        'id="xs-injectables-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' }>
                                        <li class="link">
                                            <a href="injectables/WebsocketService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WebsocketService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' : 'data-target="#xs-pipes-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' :
                                            'id="xs-pipes-links-module-SharedModule-1a385dc3a1377c3a403908439f31e43a"' }>
                                            <li class="link">
                                                <a href="pipes/ArrayFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ArrayFilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/BytesPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BytesPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DurationPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DurationPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SearchPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SlugifyPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SlugifyPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Route.html" data-type="entity-link">Route</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});