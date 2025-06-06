import * as fz from "../converters/fromZigbee";
import * as tz from "../converters/toZigbee";
import * as exposes from "../lib/exposes";
import * as m from "../lib/modernExtend";
import * as reporting from "../lib/reporting";
import type {DefinitionWithExtend} from "../lib/types";

const e = exposes.presets;
const ea = exposes.access;

export const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ["HA-ZM12/24-1K"],
        model: "HA-ZM12/24-1K",
        vendor: "Halemeier",
        description: "1-channel smart receiver",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["HA-ZM12/24-mw2"],
        model: "HA-ZM12/24-mw2",
        vendor: "Halemeier",
        description: "MultiWhite 1-channel smart receiver 12V",
        extend: [m.light({colorTemp: {range: [160, 450]}})],
    },
    {
        zigbeeModel: ["HA-ZGMW2-E"],
        model: "HA-ZGMW2-E",
        vendor: "Halemeier",
        description: "LED driver",
        extend: [m.light({colorTemp: {range: [160, 450]}})],
    },
    {
        zigbeeModel: ["HA-ZSM-MW2"],
        model: "HA-ZSM-MW2",
        vendor: "Halemeier",
        description: "S-Mitter MultiWhite2 smart remote control",
        fromZigbee: [fz.battery, fz.command_step, fz.command_step_color_temperature, fz.command_recall, fz.command_off, fz.command_on],
        toZigbee: [tz.battery_percentage_remaining],
        exposes: [
            e.action_group(),
            e.battery().withAccess(ea.STATE_GET),
            e.action([
                "recall_*",
                "on",
                "off",
                "color_temperature_step_up",
                "color_temperature_step_down",
                "brightness_step_up",
                "brightness_step_down",
            ]),
        ],
    },
    {
        zigbeeModel: ["HA-ZBM-MW2"],
        model: "HA-ZBM-MW2",
        vendor: "Halemeier",
        description: "S-Mitter basic MultiWhite² 1-channel sender Zigbee ",
        fromZigbee: [fz.command_recall, fz.command_off, fz.command_on, fz.command_step_color_temperature, fz.command_step, fz.battery],
        toZigbee: [tz.battery_percentage_remaining],
        exposes: [
            e.battery().withAccess(ea.STATE_GET),
            e.action([
                "on",
                "off",
                "recall_1",
                "recall_2",
                "recall_3",
                "recall_4",
                "color_temperature_step_up",
                "color_temperature_step_down",
                "brightness_step_up",
                "brightness_step_down",
            ]),
        ],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg"]);
            await reporting.batteryPercentageRemaining(endpoint);
        },
    },
    {
        zigbeeModel: ["HA-ZX1"],
        model: "HA-ZX1",
        vendor: "Halemeier",
        description: "X-Mitter smart remote control",
        extend: [m.battery(), m.identify()],
        fromZigbee: [fz.command_off, fz.command_on, fz.command_stop, fz.command_move],
        exposes: [e.action(["recall_*", "on", "off", "brightness_move_up", "brightness_move_down"])],
    },
    {
        zigbeeModel: ["HA-ZM12mw2-4K"],
        model: "HA-ZM12mw2-4K",
        vendor: "Halemeier",
        description: "4-channel LED driver",
        extend: [
            m.light({colorTemp: {range: [160, 450]}, endpointNames: ["l1", "l2", "l3", "l4"]}),
            m.deviceEndpoints({endpoints: {l1: 1, l2: 2, l3: 3, l4: 4}}),
        ],
    },
];
