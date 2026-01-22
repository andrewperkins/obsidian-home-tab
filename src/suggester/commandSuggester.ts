import { Platform, View, type App, type Command } from 'obsidian'
import type HomeTab from '../main'
import type HomeTabSearchBar from "../homeTabSearchbar"
import { TextInputSuggester } from './suggester'
import { generateHotkeySuggestion } from '../utils/htmlUtils'
import { get } from 'svelte/store'
import CommandSuggestion from '../ui/svelteComponents/commandSuggestion.svelte'

export default class CommandSuggester extends TextInputSuggester<Command>{
    private commands: Command[]

    private view: View
    private plugin: HomeTab
    private searchBar: HomeTabSearchBar

    constructor(app: App, plugin: HomeTab, view: View, searchBar: HomeTabSearchBar) {
        super(app, get(searchBar.searchBarEl), get(searchBar.suggestionContainerEl), {
                // @ts-ignore
                containerClass: `home-tab-suggestion-container ${Platform.isPhone ? 'is-phone' : ''}`,
                additionalClasses: `${plugin.settings.selectionHighlight === 'accentColor' ? 'use-accent-color' : ''}`,
                additionalModalInfo: plugin.settings.showShortcuts ? generateHotkeySuggestion([
                    {hotkey: '↑↓', action: 'to navigate'},
                    {hotkey: '↵', action: 'to execute'},
                    {hotkey: 'ctrl+p', action: 'to pin/unpin'},
                    {hotkey: 'esc', action: 'to dismiss'},], 
                    'home-tab-hotkey-suggestions') : undefined
                }, plugin.settings.searchDelay)
        this.plugin = plugin
        this.view = view
        this.searchBar = searchBar

        this.commands = (this.app as any).commands.listCommands()
    }

    getSuggestions(input: string): Command[] {
        if (!input) return []

        const lowerInput = input.toLowerCase()
        return this.commands.filter(command => 
            command.name.toLowerCase().includes(lowerInput) ||
            command.id.toLowerCase().includes(lowerInput)
        ).slice(0, this.plugin.settings.maxResults)
    }

    useSelectedItem(selectedItem: Command): void {
        (this.app as any).commands.executeCommandById(selectedItem.id)
    }

    getDisplayElementComponentType(): typeof CommandSuggestion {
        return CommandSuggestion
    }

    getDisplayElementProps(command: Command): any {
        return {
            command: command,
            plugin: this.plugin
        }
    }

    onNoSuggestion(): void {
        // Do nothing
    }

    scrollSelectedItemIntoView(): void {
        // Implementation for scrolling
    }
}