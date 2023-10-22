import { moduleID } from "./main.js";

export class ItemPropertiesConfig extends FormApplication {
    constructor(object, options = {}) {
        super(object, options);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: 'Item Properties',
            id: `${moduleID}`,
            template: `modules/${moduleID}/templates/item-properties-config.hbs`,
            width: 300,
            height: 'auto',
            submitOnChange: false,
            closeOnSubmit: false
        });
    }

    getData() {
        const data = super.getData();
        const properties = game.settings.get(moduleID, 'itemProperties');
        const propertiesArray = Object.entries(properties).sort((a, b) => {
            return a[0][1] < b[0][1] ? -1 : 1;
        });
        data.properties = {};
        for (const [k, v] of propertiesArray) {
            data.properties[k] = {
                name: v[0],
                tooltip: v[1]
            };
        }

        return data;
    }

    activateListeners($html) {
        super.activateListeners($html);

        const html = $html[0];
        const addButton = html.querySelector('button.add');
        addButton.addEventListener('click', async () => {
            const itemProperties = game.settings.get(moduleID, 'itemProperties');
            let num = 0;
            while (itemProperties[`prop${num}`]) num++;
            itemProperties[`prop${num}`] = 'New Property';
            await game.settings.set(moduleID, 'itemProperties', itemProperties);

            this.render();
        });

        html.addEventListener('click', async ev => {
            const { target } = ev;
            if (!target.classList.contains('fa-trash')) return;

            const key = target.closest('a').previousElementSibling.name;
            const itemProperties = game.settings.get(moduleID, 'itemProperties');

            const res = await Dialog.confirm({
                title: 'Delete Property?',
                content: `Are you sure you want to delete ${itemProperties[key]}?`,
                yes: () => { },
                no: () => { }
            });
            if (res === 'no' || !res) return;

            delete itemProperties[key];
            await game.settings.set(moduleID, 'itemProperties', itemProperties);

            this.render();
        });

        html.querySelector('button.save').addEventListener('click', () => this.close());
    }

    _updateObject(event, formData) {
        const settingsData = {};
        const fd = Object.entries(formData);
        for (let i = 0; i < fd.length; i += 2) {
            settingsData[fd[i][0]] = {
                name: fd[i][1],
                tooltip: fd[i + 1][1]
            }
        }

        return game.settings.set(moduleID, 'itemProperties', settingsData);
    }
}
