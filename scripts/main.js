import { ItemPropertiesConfig } from './ItemPropertiesConfig.js';

export const moduleID = 'item-properties';


Hooks.once('init', () => {
    game.settings.register(moduleID, 'itemProperties', {
        scope: 'world',
        type: Object,
        default: {}
    });

    game.settings.registerMenu(moduleID, 'itemPropertiesConfig', {
        name: 'Item Properties',
        label: 'Customize',
        icon: 'fas fa-cog',
        type: ItemPropertiesConfig,
        restricted: true
    });
});


Hooks.on('renderItemSheet5e', async (app, [html], appData) => {
    const item = app.object;
    if (item.type === 'weapon') return;

    const detailsTab = html.querySelector('div.tab.details');
    if (!detailsTab) return;

    const flagData = item.getFlag(moduleID, 'itemProperties');
    const itemProperties = game.settings.get(moduleID, 'itemProperties');
    const itemPropertiesDiv = document.createElement('div');
    itemPropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties');
    itemPropertiesDiv.innerHTML = `<label>Item Properties</label>`;
    for (const [id, property] of Object.entries(itemProperties)) {
        itemPropertiesDiv.innerHTML += `
            <label class="checkbox">
                <input type="checkbox" name="flags.${moduleID}.itemProperties.${id}" ${flagData?.[id] ? 'checked' : ''}>
                ${property}
            </label>
        `;
    }
    
    detailsTab.prepend(itemPropertiesDiv);
});
