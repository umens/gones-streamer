interface Window {
    /**
     * Expose Environment versions.
     * @example
     * console.log( window.versions )
     */
    readonly app: { getConfig: () => Promise<import("F:/Devs/gones-streamer/src/Models/Models").StoreType>; saveToStore: (params: { store: import("F:/Devs/gones-streamer/src/Models/Models").StoreType; }) => Promise<void>; sendToScoreboard: (params: { body: { GameStatut: import("F:/Devs/gones-streamer/src/Models/Models").GameStatut; LiveSettings: import("F:/Devs/gones-streamer/src/Models/Models").LiveSettings; }; }) => Promise<void>; uploadFile: (params: { file: string; isBg?: boolean; isHomeTeam?: boolean; }) => Promise<string>; uploadSponsor: (params: { action: string; sponsor?: import("F:/Devs/gones-streamer/src/Models/Models").Sponsor; id?: string; }) => Promise<import("F:/Devs/gones-streamer/src/Models/Models").Sponsor[]>; };
    readonly obs: { setupPreview: ({ width, height, x, y }: { width: number; height: number; x: number; y: number; }) => Promise<any>; resizePreview: ({ width, height, x, y }: { width: number; height: number; x: number; y: number; }) => Promise<any>; removePreview: () => Promise<void>; listenResize: () => void; startStats: () => Promise<boolean>; stopStats: () => Promise<boolean>; setActiveScene: (scene: import("F:/Devs/gones-streamer/src/Models/Models").SceneName) => Promise<void>; changeSourceVisibility: (data: { source: string; visible: boolean; scene: import("F:/Devs/gones-streamer/src/Models/Models").SceneName; }) => Promise<void>; changeSourceText: (data: { source: string; text: string; scene: import("F:/Devs/gones-streamer/src/Models/Models").SceneName; }) => Promise<void>; };
}
