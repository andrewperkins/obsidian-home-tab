<script lang="ts">
    import { Command } from "lucide-svelte";
    import type { TextInputSuggester } from "src/suggester/suggester";
    import type HomeTab from "src/main";
    import Suggestion from './suggestion.svelte';

    export let index: number
    export let textInputSuggester: TextInputSuggester<any>
    export let selectedItemIndex: number
    export let command: any

    export let plugin: HomeTab

    function togglePin() {
        const pinned = plugin.settings.pinnedCommands
        const commandId = command.id
        if (pinned.includes(commandId)) {
            plugin.settings.pinnedCommands = pinned.filter(id => id !== commandId)
        } else {
            plugin.settings.pinnedCommands = [...pinned, commandId]
        }
        plugin.saveSettings()
        plugin.refreshOpenViews()
    }
</script>

<Suggestion {index} {textInputSuggester} {selectedItemIndex}
    suggestionTitleClass="suggestion-title home-tab-suggestion-title">
    <!-- Command name -->
    <svelte:fragment slot="suggestion-title">
        <span>{command.name}</span>
    </svelte:fragment>
    <!-- Command details -->
    <svelte:fragment slot="suggestion-extra-content">
        <div class="home-tab-suggestion-description">
            <Command size={15} aria-label={'Command'}/>
            <span>{command.id}</span>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="suggestion-aux">
        <button class="home-tab-pin-button" on:click|stopPropagation={togglePin}>
            {#if plugin.settings.pinnedCommands.includes(command.id)}
                📌
            {:else}
                📍
            {/if}
        </button>
    </svelte:fragment>
</Suggestion>

<style>
    .home-tab-pin-button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        opacity: 0.7;
    }
    .home-tab-pin-button:hover {
        opacity: 1;
    }
</style>