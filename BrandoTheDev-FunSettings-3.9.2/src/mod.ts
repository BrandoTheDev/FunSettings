import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

class Mod implements IPostDBLoadMod
{
    private modConfig = require("../config/config.json");

    public postAkiLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");

        const hideout = this.modConfig.Hideout;
        const scavCase = this.modConfig.Scavcase;
        const traders = this.modConfig.Traders;
        const pmc = this.modConfig.PMC;
        const weapons = this.modConfig.Weapons;
        const ammo = this.modConfig.Ammo;
        const misc = this.modConfig.Misc;

        if (this.modConfig.showOptions)
        {
            // Only show sections if it's enabled
            if (hideout.Enabled)
            {
                logger.logWithColor("--- HIDEOUT SETTINGS ---", LogTextColor.YELLOW)
                logger.info(`Production Time: ${hideout.ProductionTime}`);
                logger.info(`Free Production Cost: ${(hideout.ProductionCostRoubles) ? "On" : "Off"}`);
                logger.info(`Areas Need Fuel: ${(hideout.AreaNeedsFuel) ? "On" : "Off"}`);
                logger.info(`Areas Need Requirements: ${(hideout.AreaNeedsRequirements) ? "On" : "Off"}`);
                logger.info(`Areas Construction Time: ${(hideout.AreaConstructionTime) ? "On" : "Off"}`);
                logger.info(`Areas Cost Materials: ${(hideout.AreaCostMaterial) ? "On" : "Off"}`);
                logger.info(`Auto Upgrade Areas: ${(hideout.AreaMaxWhenUpgraded) ? "On" : "Off"}`);
                logger.logWithColor("------------------------", LogTextColor.YELLOW)
            }

            if (scavCase.Enabled)
            {
                logger.logWithColor("--- SCAVCASE SETTINGS ---", LogTextColor.YELLOW)
                logger.info(`Cost Roubles: ${(scavCase.CostRoubles) ? "On" : "Off"}`);
                logger.info(`Instant Production: ${(scavCase.InstantProduction) ? "On" : "Off"}`);
                logger.logWithColor("-------------------------", LogTextColor.YELLOW)
            }

            if (traders.Enabled)
            {
                logger.logWithColor("--- TRADER SETTINGS ---", LogTextColor.YELLOW)
                logger.info(`Unlock All Traders: ${(traders.unlockAll) ? "On" : "Off"}`);
                logger.info(`Max Loyalty Level: ${(traders.maxLoyaltyLevel) ? "On" : "Off"}`);
                logger.info(`All outfits unlocked: ${(traders.allOutfitsUnlocked) ? "On" : "Off"}`);
                logger.info(`FREE After Raid Healing: ${(traders.freeTherapistHealing) ? "On" : "Off"}`);
                logger.logWithColor("-----------------------", LogTextColor.YELLOW)
            }

            if (pmc.Enabled)
            {
                logger.logWithColor("--- PMC SETTINGS ---", LogTextColor.YELLOW)
                logger.info(`Disable Fall Damage: ${(pmc.disableFallDamage) ? "On" : "Off"}`);
                logger.info(`Super Long Sprinting: ${(pmc.superLongSprinting) ? "On" : "Off"}`);
                logger.logWithColor("--------------------", LogTextColor.YELLOW)
            }

            if (weapons.Enabled)
            {
                logger.logWithColor("--- WEAPON SETTINGS ---", LogTextColor.YELLOW)
                logger.info(`Disable Build Restrictions: ${(weapons.disableRestrictions) ? "On" : "Off"}`);
                logger.info(`Allow Jams & Malfunctions: ${(weapons.CanJamOrMalfunction) ? "On" : "Off"}`);
                logger.info(`Allow Durability Loss: ${(weapons.CanLoseDurability) ? "On" : "Off"}`);
                logger.info(`Reload Magazines Fast: ${(weapons.superFastMagazineReload) ? "On" : "Off"}`);
                logger.logWithColor("------------------------", LogTextColor.YELLOW)
            }

            if (ammo.Enabled)
            {
                logger.logWithColor("--- AMMO SETTINGS ---", LogTextColor.YELLOW)
                logger.info(`Bullet Stack Size: ${ammo.bulletStackSize}`);
                logger.info(`Buckshot Stack Size: ${ammo.buckshotStackSize}`);
                logger.info(`Grenade Stack Size: ${ammo.grenadeStackSize}`);
                logger.info(`Weightless Ammo: ${(ammo.weightlessAmmo) ? "On" : "Off"}`);
                logger.logWithColor("---------------------", LogTextColor.YELLOW)
            }

            if (misc.Enabled)
            {
                logger.logWithColor("--- MISC SETTINGS ---", LogTextColor.YELLOW);
                logger.info(`Labs Entrance is Free: ${(misc.freeLabsEntrance) ? "On" : "Off"}`);
                logger.info(`Disable Key Use Limits: ${(misc.unlimitedKeyUses) ? "On" : "Off"}`);
                logger.info(`All items examined: ${(misc.allItemsExamined) ? "On" : "Off"}`);
                logger.info(`Disable Gear Restrictions: ${(misc.disableGearRestrictions) ? "On" : "Off"}`);
                logger.logWithColor("---------------------", LogTextColor.YELLOW);
            }
        }

        const green = LogTextColor.GREEN;
        const red = LogTextColor.RED;

        logger.logWithColor("Brandos Fun Settings Loaded!", green);
        logger.logWithColor(`-- Hideout : ${(hideout.Enabled) ? "ENABLED" : "DISABLED"}`, (hideout.Enabled) ? green : red);
        logger.logWithColor(`-- ScavCase: ${(scavCase.Enabled) ? "ENABLED" : "DISABLED"}`, (scavCase.Enabled) ? green : red);
        logger.logWithColor(`-- Traders : ${(traders.Enabled) ? "ENABLED" : "DISABLED"}`, (traders.Enabled) ? green : red);
        logger.logWithColor(`-- PMC     : ${(pmc.Enabled) ? "ENABLED" : "DISABLED"}`, (pmc.Enabled) ? green : red);
        logger.logWithColor(`-- Weapons : ${(weapons.Enabled) ? "ENABLED" : "DISABLED"}`, (weapons.Enabled) ? green : red);
        logger.logWithColor(`-- Ammo    : ${(ammo.Enabled) ? "ENABLED" : "DISABLED"}`, (ammo.Enabled) ? green : red);
        logger.logWithColor(`-- Misc    : ${(misc.Enabled) ? "ENABLED" : "DISABLED"}`, (misc.Enabled) ? green : red);
        logger.logWithColor("-----------------------------", green);
    }

    public postDBLoad(container: DependencyContainer): void
    {
        // Get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();

        // Get the item table from the tables
        const itemTable = tables.templates.items;

        // Get the config table
        const configTable = tables.globals.config;

        // Enable/Disable settings for Hideout
        if (this.modConfig.Hideout.Enabled)
        {
            // Get the hideout table
            const hideoutTable = tables.hideout;
            // Each individual area in the hideout
            const hideoutAreas = hideoutTable.areas;
            // Production of crafting items
            const hideoutProduction = hideoutTable.production;
            // Scav case has its own table
            const scavCase = hideoutTable.scavcase;

            if (this.modConfig.Scavcase.Enabled)
            {
                for (const area in scavCase)
                {
                    const requirements = scavCase[area].Requirements;

                    if (this.modConfig.Scavcase.CostRoubles)
                    {
                        for (const reqs in requirements)
                        {
                            requirements[reqs].templateId = "5449016a4bdc2d6f028b456f";
                            requirements[reqs].count = 1;
                            requirements[reqs].isFunctional = true;
                        }
                    }

                    if (this.modConfig.Scavcase.InstantProduction)
                    {
                        scavCase[area].ProductionTime = 1;
                    }

                }
            }


            for (const prod in hideoutProduction)
            {
                // LOWER number (in seconds) for FASTER production time
                hideoutProduction[prod].productionTime = this.modConfig.Hideout.ProductionTime;

                if (this.modConfig.Hideout.ProductionCostRoubles)
                {
                    const requirement = hideoutProduction[prod].requirements;

                    for (const reqs in requirement)
                    {
                        requirement[reqs].type = "Item";
                        requirement[reqs].templateId = "5449016a4bdc2d6f028b456f";
                        requirement[reqs].count = 1;
                        requirement[reqs].requiredLevel = 0;
                        requirement[reqs].isFunctional = true;
                        requirement[reqs].questId = "";
                    }
                }
            }

            for (const areas in hideoutAreas)
            {
                hideoutAreas[areas].enabled = true;

                // Allows production without fuel in generator
                if (!this.modConfig.Hideout.AreaNeedsFuel)
                {
                    hideoutAreas[areas].needsFuel = false;
                }

                // Disable requirements needed for the Area
                if (!this.modConfig.Hideout.AreaNeedsRequirements)
                {
                    const reqs = hideoutAreas[areas].requirements;
                    for (const r in reqs)
                    {
                        reqs[r].requiredlevel = 0;
                    }
                }

                const stages = hideoutAreas[areas].stages;
                for (const stage in stages)
                {
                    // Auto upgrades the Area to its max level
                    if (this.modConfig.Hideout.AreaMaxWhenUpgraded)
                    {
                        stages[stage].autoUpgrade = true;
                    }

                    stages[stage].constructionTime = this.modConfig.AreaConstructionTime;

                    // Remove the material amount needed to upgrade Areas
                    if (!this.modConfig.Hideout.AreaCostMaterial)
                    {
                        const reqs = stages[stage].requirements;
                        for (const r in reqs)
                        {
                            reqs[r].count = 0;
                            reqs[r].requiredLevel = 0;
                            reqs[r].loyaltyLevel = 0;
                            reqs[r].skillLevel = 0;
                            reqs[r].isFunctional = true;
                        }
                    }
                }
            }
        }

        // Enable/Disable settings for Traders
        if (this.modConfig.Traders.Enabled)
        {
            // Get the trader table
            const traderTable = tables.traders;
            for (const trader in traderTable)
            {
                // Basically just unlocks Jagaer as far as I can tell
                if (this.modConfig.Traders.unlockAll)
                {
                    traderTable[trader].base.unlockedByDefault = true;
                }

                // Max Loyalty or Rep with a trader
                if (this.modConfig.Traders.maxLoyaltyLevel)
                {
                    const loyaltyLevels = traderTable[trader].base.loyaltyLevels;
                    for (const level in loyaltyLevels)
                    {
                        loyaltyLevels[level].minLevel = 0;
                        loyaltyLevels[level].minSalesSum = 0;
                        loyaltyLevels[level].minStanding = 0;
                    }

                    tables.globals.config.MaxLoyaltyLevelForAll = true;
                }

                // Unlock every outfit for your bear or usec
                if (this.modConfig.Traders.allOutfitsUnlocked)
                {
                    const suits = traderTable[trader].suits;
                    for (const suit in suits)
                    {
                        suits[suit].isActive = true;
                        const itemReqs = suits[suit].requirements.itemRequirements;
                        for (const reqs in itemReqs)
                        {
                            itemReqs[reqs].count = 0;
                        }
                        suits[suit].requirements.loyaltyLevel = 0;
                        suits[suit].requirements.profileLevel = 0;
                        suits[suit].requirements.questRequirements = [""];
                        suits[suit].requirements.skillRequirements = [""];
                        suits[suit].requirements.standing = 0;
                    }
                }
            }
            // After raid healing is free until level 99 (not possible?)
            if (this.modConfig.Traders.freeTherapistHealing)
            {
                configTable.Health.HealPrice.TrialLevels = 99;
            }
        }

        if (this.modConfig.PMC.Enabled)
        {
            // Remove fall damage
            if (this.modConfig.PMC.disableFallDamage)
            {
                configTable.FractureCausedByFalling.B = 0;
                configTable.FractureCausedByFalling.K = 0;
                configTable.Health.Falling.DamagePerMeter = 0;
            }

            // Basically infinite sprint stamina
            if (this.modConfig.PMC.superLongSprinting)
            {
                configTable.Stamina.Capacity = 99999;
            }
        }

        // Free labs -- no entrance key/fee required
        if (this.modConfig.Misc.freeLabsEntrance && this.modConfig.Misc.Enabled)
        {
            // Grab the map laboratory
            const labs = tables.locations.laboratory.base;
            labs.AccessKeys.length = 0;
        }

        for (const itemId in itemTable)
        {
            const itemProps = itemTable[itemId]._props;
            const ammoType = itemProps.ammoType;

            // Enable/Disable Misc Block
            if (this.modConfig.Misc.Enabled)
            {
                // Removes the uses (1/1, 40/40, etc from keys)
                if (this.modConfig.Misc.unlimitedKeyUses)
                {
                    // Unlimited Key Usage
                    const itemSound = itemTable[itemId]._props?.ItemSound;
                    if (itemSound === "keys" || itemSound === "item_plastic_generic")
                    {
                        if (itemTable[itemId]._props?.MaximumNumberOfUsage > 0)
                        {
                            itemTable[itemId]._props.MaximumNumberOfUsage = 0;
                        }
                    }
                }

                if (this.modConfig.Misc.allItemsExamined)
                {
                    itemProps.ExaminedByDefault = true;
                }

                if (this.modConfig.Misc.disableGearRestrictions)
                {
                    itemProps.BlocksArmorVest = false;
                    itemProps.BlocksCollapsible = false;
                    itemProps.BlocksEarpiece = false;
                    itemProps.BlocksEyewear = false;
                    itemProps.BlocksFaceCover = false;
                    itemProps.BlocksFolding = false;
                    itemProps.BlocksHeadwear = false;
                }
            }

            if (this.modConfig.Weapons.Enabled)
            {
                if (ammoType === "bullet" || ammoType === "buckshot" || ammoType === "grenade")
                {
                    // Prevent any type of jams/malfunctions
                    if (!this.modConfig.Weapons.CanJamOrMalfunction)
                    {
                        itemProps.MisfireChance = 0;
                        itemProps.MalfMisfireChance = 0;
                        itemProps.AllowMisfire = false;
                        itemProps.HeatFactor = 0;
                    }

                    // Prevent weapon durability loss
                    if (!this.modConfig.Weapons.CanLoseDurability)
                    {
                        itemProps.DurabilityBurnModificator = 0;
                        itemProps.DurabilityBurnRatio = 0;
                    }
                }

                // Assemble weapon parts that block each other
                if (this.modConfig.Weapons.disableRestrictions)
                {
                    if (itemProps && itemProps.ConflictingItems && itemProps.ConflictingItems.length > 0)
                    {
                        itemProps.ConflictingItems.length = 0;
                    }
                }

                // Load all magazines faster
                if (this.modConfig.Weapons.superFastMagazineReload)
                {
                    tables.globals.config.BaseLoadTime = 0.1;
                    tables.globals.config.BaseUnloadTime = 0.1;
                }
            }

            if (this.modConfig.Ammo.Enabled)
            {
                if (ammoType === "bullet" || ammoType === "buckshot" || ammoType === "grenade")
                {
                    if (ammoType === "bullet")
                    {
                        itemProps.StackMaxSize = this.modConfig.Ammo.bulletStackSize;
                    }

                    else if (ammoType === "buckshot")
                    {
                        itemProps.StackMaxSize = this.modConfig.Ammo.buckshotStackSize;
                    }

                    else if (ammoType === "grenade")
                    {
                        itemProps.StackMaxSize = this.modConfig.Ammo.grenadeStackSize;
                    }

                    // Prevent ammo stacks from weighing us down!
                    if (this.modConfig.Ammo.weightlessAmmo)
                    {
                        itemProps.Weight = 0;
                    }
                }
            }
        }
    }
}

module.exports = { mod: new Mod() }