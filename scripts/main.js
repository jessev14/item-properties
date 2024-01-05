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

    game.settings.register(moduleID, 'migrationV1.2.0', {
        scope: 'world',
        type: Boolean,
        default: false
    });

    libWrapper.register(moduleID, 'CONFIG.Item.documentClass.prototype.getChatData', newGetChatData, 'WRAPPER');
});

Hooks.once('ready', async () => {
    if (game.settings.get(moduleID, 'migrationV1.2.0')) return;

    const itemProperties = game.settings.get(moduleID, 'itemProperties');
    const migratedData = {};
    if (Object.entries(itemProperties).length) {
        for (const [k, v] of Object.entries(itemProperties)) {
            migratedData[k] = {
                name: v,
                tooltip: ''
            };
        }   
    } else return game.settings.set(moduleID, 'migrationV1.2.0', true);

    await game.settings.set(moduleID, 'itemProperties', migratedData);
    return game.settings.set(moduleID, 'migrationV1.2.0', true);
});


Hooks.on('renderItemSheet5e', async (app, [html], appData) => {
    const detailsTab = html.querySelector('div.tab.details') || html.querySelector('div.tidy-tab.details');
    if (!detailsTab) return;

    const item = app.object;
    const flagData = item.getFlag(moduleID, 'itemProperties');
    const itemProps = game.settings.get(moduleID, 'itemProperties');
    const itemPropsArray = Object.entries(itemProps).sort((a, b) => {
        return a[0][1] < b[0][1] ? -1 : 1;
    });
    const itemProperties = {};
    for (const [k, v] of itemPropsArray) {
        itemProperties[k] = v;
    }

    const itemPropertiesDiv = document.createElement('div');
    itemPropertiesDiv.classList.add('form-group', 'stacked', 'weapon-properties');
    itemPropertiesDiv.innerHTML = `<label>Item Properties</label>`;
    for (const [id, property] of Object.entries(itemProperties)) {
        itemPropertiesDiv.innerHTML += `
            <label class="checkbox" data-tooltip=${property.tooltip}>
                <input type="checkbox" name="flags.${moduleID}.itemProperties.${id}" ${flagData?.[id] ? 'checked' : ''}>
                ${property.name}
            </label>
        `;
    }
    detailsTab.prepend(itemPropertiesDiv);

    const Ols =  html.querySelectorAll('ol.properties-list');
    const propertiesOl = Ols?.[1] || Ols?.[0];
    if (!propertiesOl || !flagData) return;

    for (const [k, v] of Object.entries(flagData)) {
        if (!v) continue;
        
        const customProperty = itemProperties[k];
        const propLi = document.createElement('li');
        propLi.innerText = customProperty.name || customProperty;
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
