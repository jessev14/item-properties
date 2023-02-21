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

    libWrapper.register(moduleID, 'CONFIG.Item.documentClass.prototype.getChatData', newGetChatData, 'WRAPPER');
});


Hooks.on('renderItemSheet5e', async (app, [html], appData) => {
    const detailsTab = html.querySelector('div.tab.details');
    if (!detailsTab) return;

    const item = app.object;
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

    const Ols =  html.querySelectorAll('ol.properties-list');
    const propertiesOl = Ols?.[1] || Ols?.[0];
    if (!propertiesOl || !flagData) return;

    for (const [k,v ] of Object.entries(flagData)) {
        if (!v) continue;
        
        const customProperty = itemProperties[k];
        const propLi = document.createElement('li');
        propLi.innerText = customProperty;
        propertiesOl.appendChild(propLi);
    }
});

async function newGetChatData(wrapped, htmlOptions = {}) {
    const data = await wrapped(htmlOptions);

    const itemProperties = game.settings.get(moduleID, 'itemProperties');
    const flagData = this.getFlag(moduleID, 'itemProperties');
    if (flagData) {
        for (const [k,v ] of Object.entries(flagData)) {
            if (!v) continue;
            
            const customProperty = itemProperties[k];
            data.properties.push(customProperty);
        }
    }

    return data;
}
