import { useState, useRef, useCallback } from "react";

const MC_VERSIONS = [
  "1.21","1.20","1.19","1.18","1.17","1.16","1.15","1.14",
  "1.13","1.12","1.11","1.10","1.9","1.8","1.7","1.6",
  "1.5","1.4","1.3","1.2","1.0",
];

type Dim = "overworld" | "nether" | "end";
interface Block { name: string; display: string; cat: string; dim: Dim; yMin: number; yMax: number; }

const BLOCKS: Block[] = [
  // Ores — Overworld
  { name:"coal_ore",              display:"Coal Ore",                   cat:"Ores",         dim:"overworld", yMin:0,   yMax:192  },
  { name:"deepslate_coal_ore",    display:"Deepslate Coal Ore",         cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  { name:"iron_ore",              display:"Iron Ore",                   cat:"Ores",         dim:"overworld", yMin:-24, yMax:256  },
  { name:"deepslate_iron_ore",    display:"Deepslate Iron Ore",         cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  { name:"copper_ore",            display:"Copper Ore",                 cat:"Ores",         dim:"overworld", yMin:-16, yMax:112  },
  { name:"deepslate_copper_ore",  display:"Deepslate Copper Ore",       cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  { name:"gold_ore",              display:"Gold Ore",                   cat:"Ores",         dim:"overworld", yMin:-64, yMax:32   },
  { name:"deepslate_gold_ore",    display:"Deepslate Gold Ore",         cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  { name:"redstone_ore",          display:"Redstone Ore",               cat:"Ores",         dim:"overworld", yMin:-64, yMax:16   },
  { name:"deepslate_redstone_ore",display:"Deepslate Redstone Ore",     cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  { name:"lapis_ore",             display:"Lapis Ore",                  cat:"Ores",         dim:"overworld", yMin:-64, yMax:64   },
  { name:"deepslate_lapis_ore",   display:"Deepslate Lapis Ore",        cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  { name:"diamond_ore",           display:"Diamond Ore",                cat:"Ores",         dim:"overworld", yMin:-64, yMax:16   },
  { name:"deepslate_diamond_ore", display:"Deepslate Diamond Ore",      cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  { name:"emerald_ore",           display:"Emerald Ore (mountains)",    cat:"Ores",         dim:"overworld", yMin:-16, yMax:320  },
  { name:"deepslate_emerald_ore", display:"Deepslate Emerald Ore",      cat:"Ores",         dim:"overworld", yMin:-64, yMax:0    },
  // Nether Ores
  { name:"nether_gold_ore",       display:"Nether Gold Ore",            cat:"Nether Ores",  dim:"nether",    yMin:10,  yMax:117  },
  { name:"nether_quartz_ore",     display:"Nether Quartz Ore",          cat:"Nether Ores",  dim:"nether",    yMin:10,  yMax:117  },
  { name:"ancient_debris",        display:"Ancient Debris",             cat:"Nether Ores",  dim:"nether",    yMin:8,   yMax:119  },
  // Stone & Geological
  { name:"stone",                 display:"Stone",                      cat:"Stone",        dim:"overworld", yMin:-64, yMax:320  },
  { name:"granite",               display:"Granite",                    cat:"Stone",        dim:"overworld", yMin:-64, yMax:320  },
  { name:"diorite",               display:"Diorite",                    cat:"Stone",        dim:"overworld", yMin:-64, yMax:320  },
  { name:"andesite",              display:"Andesite",                   cat:"Stone",        dim:"overworld", yMin:-64, yMax:320  },
  { name:"deepslate",             display:"Deepslate",                  cat:"Stone",        dim:"overworld", yMin:-64, yMax:0    },
  { name:"tuff",                  display:"Tuff",                       cat:"Stone",        dim:"overworld", yMin:-64, yMax:0    },
  { name:"calcite",               display:"Calcite",                    cat:"Stone",        dim:"overworld", yMin:0,   yMax:80   },
  { name:"gravel",                display:"Gravel",                     cat:"Stone",        dim:"overworld", yMin:-64, yMax:320  },
  { name:"sand",                  display:"Sand",                       cat:"Stone",        dim:"overworld", yMin:60,  yMax:65   },
  { name:"red_sand",              display:"Red Sand",                   cat:"Stone",        dim:"overworld", yMin:60,  yMax:80   },
  { name:"sandstone",             display:"Sandstone",                  cat:"Stone",        dim:"overworld", yMin:55,  yMax:70   },
  { name:"red_sandstone",         display:"Red Sandstone",              cat:"Stone",        dim:"overworld", yMin:55,  yMax:80   },
  { name:"clay",                  display:"Clay",                       cat:"Stone",        dim:"overworld", yMin:59,  yMax:68   },
  { name:"dirt",                  display:"Dirt",                       cat:"Stone",        dim:"overworld", yMin:58,  yMax:320  },
  { name:"coarse_dirt",           display:"Coarse Dirt",                cat:"Stone",        dim:"overworld", yMin:58,  yMax:200  },
  { name:"rooted_dirt",           display:"Rooted Dirt",                cat:"Stone",        dim:"overworld", yMin:50,  yMax:100  },
  { name:"podzol",                display:"Podzol",                     cat:"Stone",        dim:"overworld", yMin:58,  yMax:200  },
  { name:"mycelium",              display:"Mycelium (mushroom fields)",  cat:"Stone",        dim:"overworld", yMin:62,  yMax:70   },
  { name:"grass_block",           display:"Grass Block",                cat:"Stone",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"snow_block",            display:"Snow Block",                 cat:"Stone",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"ice",                   display:"Ice",                        cat:"Stone",        dim:"overworld", yMin:62,  yMax:65   },
  { name:"packed_ice",            display:"Packed Ice",                 cat:"Stone",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"blue_ice",              display:"Blue Ice",                   cat:"Stone",        dim:"overworld", yMin:55,  yMax:70   },
  { name:"obsidian",              display:"Obsidian",                   cat:"Stone",        dim:"overworld", yMin:-64, yMax:320  },
  { name:"crying_obsidian",       display:"Crying Obsidian",            cat:"Stone",        dim:"overworld", yMin:-64, yMax:128  },
  { name:"magma_block",           display:"Magma Block",                cat:"Stone",        dim:"overworld", yMin:25,  yMax:55   },
  // Nether Blocks
  { name:"netherrack",            display:"Netherrack",                 cat:"Nether",       dim:"nether",    yMin:0,   yMax:128  },
  { name:"soul_sand",             display:"Soul Sand",                  cat:"Nether",       dim:"nether",    yMin:30,  yMax:90   },
  { name:"soul_soil",             display:"Soul Soil",                  cat:"Nether",       dim:"nether",    yMin:30,  yMax:90   },
  { name:"crimson_nylium",        display:"Crimson Nylium",             cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"warped_nylium",         display:"Warped Nylium",              cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"blackstone",            display:"Blackstone",                 cat:"Nether",       dim:"nether",    yMin:5,   yMax:100  },
  { name:"basalt",                display:"Basalt",                     cat:"Nether",       dim:"nether",    yMin:0,   yMax:128  },
  { name:"smooth_basalt",         display:"Smooth Basalt",              cat:"Nether",       dim:"nether",    yMin:0,   yMax:128  },
  { name:"gilded_blackstone",     display:"Gilded Blackstone",          cat:"Nether",       dim:"nether",    yMin:5,   yMax:100  },
  { name:"nether_wart",           display:"Nether Wart",                cat:"Nether",       dim:"nether",    yMin:0,   yMax:128  },
  { name:"warped_fungus",         display:"Warped Fungus",              cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"crimson_fungus",        display:"Crimson Fungus",             cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"warped_roots",          display:"Warped Roots",               cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"crimson_roots",         display:"Crimson Roots",              cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"nether_sprouts",        display:"Nether Sprouts",             cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"shroomlight",           display:"Shroomlight",                cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"weeping_vines",         display:"Weeping Vines",              cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"twisting_vines",        display:"Twisting Vines",             cat:"Nether",       dim:"nether",    yMin:0,   yMax:120  },
  { name:"nether_brick",          display:"Nether Brick",               cat:"Nether",       dim:"nether",    yMin:0,   yMax:128  },
  { name:"red_nether_brick",      display:"Red Nether Brick",           cat:"Nether",       dim:"nether",    yMin:0,   yMax:128  },
  { name:"lodestone",             display:"Lodestone",                  cat:"Nether",       dim:"nether",    yMin:0,   yMax:128  },
  // End Blocks
  { name:"end_stone",             display:"End Stone",                  cat:"End",          dim:"end",       yMin:40,  yMax:100  },
  { name:"chorus_plant",          display:"Chorus Plant",               cat:"End",          dim:"end",       yMin:60,  yMax:120  },
  { name:"chorus_flower",         display:"Chorus Flower",              cat:"End",          dim:"end",       yMin:60,  yMax:120  },
  { name:"purpur_block",          display:"Purpur Block",               cat:"End",          dim:"end",       yMin:40,  yMax:100  },
  { name:"purpur_pillar",         display:"Purpur Pillar",              cat:"End",          dim:"end",       yMin:40,  yMax:100  },
  { name:"end_stone_bricks",      display:"End Stone Bricks",           cat:"End",          dim:"end",       yMin:40,  yMax:100  },
  // Logs & Leaves
  { name:"oak_log",               display:"Oak Log",                    cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"spruce_log",            display:"Spruce Log",                 cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"birch_log",             display:"Birch Log",                  cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"jungle_log",            display:"Jungle Log",                 cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"acacia_log",            display:"Acacia Log",                 cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"dark_oak_log",          display:"Dark Oak Log",               cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"mangrove_log",          display:"Mangrove Log",               cat:"Trees",        dim:"overworld", yMin:60,  yMax:70   },
  { name:"cherry_log",            display:"Cherry Log",                 cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"pale_oak_log",          display:"Pale Oak Log",               cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"oak_leaves",            display:"Oak Leaves",                 cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"spruce_leaves",         display:"Spruce Leaves",              cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"birch_leaves",          display:"Birch Leaves",               cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"jungle_leaves",         display:"Jungle Leaves",              cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"acacia_leaves",         display:"Acacia Leaves",              cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"dark_oak_leaves",       display:"Dark Oak Leaves",            cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"mangrove_leaves",       display:"Mangrove Leaves",            cat:"Trees",        dim:"overworld", yMin:60,  yMax:70   },
  { name:"cherry_leaves",         display:"Cherry Leaves",              cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  { name:"pale_oak_leaves",       display:"Pale Oak Leaves",            cat:"Trees",        dim:"overworld", yMin:60,  yMax:320  },
  // Plants & Vegetation
  { name:"azalea",                display:"Azalea",                     cat:"Plants",       dim:"overworld", yMin:-64, yMax:100  },
  { name:"flowering_azalea",      display:"Flowering Azalea",           cat:"Plants",       dim:"overworld", yMin:-64, yMax:100  },
  { name:"azalea_leaves",         display:"Azalea Leaves",              cat:"Plants",       dim:"overworld", yMin:-64, yMax:100  },
  { name:"flowering_azalea_leaves",display:"Flowering Azalea Leaves",   cat:"Plants",       dim:"overworld", yMin:-64, yMax:100  },
  { name:"moss_block",            display:"Moss Block",                 cat:"Plants",       dim:"overworld", yMin:-64, yMax:100  },
  { name:"moss_carpet",           display:"Moss Carpet",                cat:"Plants",       dim:"overworld", yMin:-64, yMax:100  },
  { name:"bamboo",                display:"Bamboo",                     cat:"Plants",       dim:"overworld", yMin:60,  yMax:320  },
  { name:"cactus",                display:"Cactus",                     cat:"Plants",       dim:"overworld", yMin:60,  yMax:80   },
  { name:"sugar_cane",            display:"Sugar Cane",                 cat:"Plants",       dim:"overworld", yMin:60,  yMax:80   },
  { name:"pumpkin",               display:"Pumpkin",                    cat:"Plants",       dim:"overworld", yMin:60,  yMax:80   },
  { name:"melon",                 display:"Melon",                      cat:"Plants",       dim:"overworld", yMin:60,  yMax:80   },
  { name:"dead_bush",             display:"Dead Bush",                  cat:"Plants",       dim:"overworld", yMin:60,  yMax:80   },
  { name:"fern",                  display:"Fern",                       cat:"Plants",       dim:"overworld", yMin:60,  yMax:320  },
  { name:"large_fern",            display:"Large Fern",                 cat:"Plants",       dim:"overworld", yMin:60,  yMax:320  },
  { name:"grass",                 display:"Grass",                      cat:"Plants",       dim:"overworld", yMin:60,  yMax:320  },
  { name:"tall_grass",            display:"Tall Grass",                 cat:"Plants",       dim:"overworld", yMin:60,  yMax:320  },
  { name:"dandelion",             display:"Dandelion",                  cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"poppy",                 display:"Poppy",                      cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"blue_orchid",           display:"Blue Orchid",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:80   },
  { name:"allium",                display:"Allium",                     cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"azure_bluet",           display:"Azure Bluet",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"red_tulip",             display:"Red Tulip",                  cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"orange_tulip",          display:"Orange Tulip",               cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"white_tulip",           display:"White Tulip",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"pink_tulip",            display:"Pink Tulip",                 cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"oxeye_daisy",           display:"Oxeye Daisy",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"cornflower",            display:"Cornflower",                 cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"lily_of_the_valley",    display:"Lily of the Valley",         cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"wither_rose",           display:"Wither Rose",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"sunflower",             display:"Sunflower",                  cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"lilac",                 display:"Lilac",                      cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"rose_bush",             display:"Rose Bush",                  cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"peony",                 display:"Peony",                      cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"pink_petals",           display:"Pink Petals",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"wildflowers",           display:"Wildflowers",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"torchflower",           display:"Torchflower",                cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"pitcher_plant",         display:"Pitcher Plant",              cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"pitcher_crop",          display:"Pitcher Crop",               cat:"Flowers",      dim:"overworld", yMin:60,  yMax:320  },
  { name:"spore_blossom",         display:"Spore Blossom",              cat:"Plants",       dim:"overworld", yMin:-64, yMax:64   },
  { name:"glow_lichen",           display:"Glow Lichen",                cat:"Plants",       dim:"overworld", yMin:-64, yMax:64   },
  { name:"hanging_roots",         display:"Hanging Roots",              cat:"Plants",       dim:"overworld", yMin:-64, yMax:100  },
  { name:"big_dripleaf",          display:"Big Dripleaf",               cat:"Plants",       dim:"overworld", yMin:-64, yMax:64   },
  { name:"small_dripleaf",        display:"Small Dripleaf",             cat:"Plants",       dim:"overworld", yMin:-64, yMax:64   },
  { name:"sweet_berry_bush",      display:"Sweet Berry Bush",           cat:"Plants",       dim:"overworld", yMin:60,  yMax:200  },
  { name:"cave_vines",            display:"Cave Vines",                 cat:"Plants",       dim:"overworld", yMin:-64, yMax:64   },
  { name:"glow_berries",          display:"Glow Berries",               cat:"Plants",       dim:"overworld", yMin:-64, yMax:64   },
  // Sculk
  { name:"sculk",                 display:"Sculk",                      cat:"Sculk",        dim:"overworld", yMin:-64, yMax:64   },
  { name:"sculk_vein",            display:"Sculk Vein",                 cat:"Sculk",        dim:"overworld", yMin:-64, yMax:64   },
  { name:"sculk_catalyst",        display:"Sculk Catalyst",             cat:"Sculk",        dim:"overworld", yMin:-64, yMax:64   },
  { name:"sculk_sensor",          display:"Sculk Sensor",               cat:"Sculk",        dim:"overworld", yMin:-64, yMax:64   },
  { name:"sculk_shrieker",        display:"Sculk Shrieker",             cat:"Sculk",        dim:"overworld", yMin:-64, yMax:64   },
  // Underwater
  { name:"seagrass",              display:"Seagrass",                   cat:"Ocean",        dim:"overworld", yMin:45,  yMax:65   },
  { name:"tall_seagrass",         display:"Tall Seagrass",              cat:"Ocean",        dim:"overworld", yMin:45,  yMax:65   },
  { name:"kelp",                  display:"Kelp",                       cat:"Ocean",        dim:"overworld", yMin:45,  yMax:65   },
  { name:"sea_pickle",            display:"Sea Pickle",                 cat:"Ocean",        dim:"overworld", yMin:45,  yMax:65   },
  { name:"coral_block",           display:"Coral Block",                cat:"Ocean",        dim:"overworld", yMin:50,  yMax:65   },
  { name:"dead_coral_block",      display:"Dead Coral Block",           cat:"Ocean",        dim:"overworld", yMin:50,  yMax:65   },
  { name:"coral",                 display:"Coral",                      cat:"Ocean",        dim:"overworld", yMin:50,  yMax:65   },
  { name:"coral_fan",             display:"Coral Fan",                  cat:"Ocean",        dim:"overworld", yMin:50,  yMax:65   },
  { name:"sponge",                display:"Sponge",                     cat:"Ocean",        dim:"overworld", yMin:30,  yMax:65   },
  { name:"wet_sponge",            display:"Wet Sponge",                 cat:"Ocean",        dim:"overworld", yMin:30,  yMax:65   },
  { name:"lily_pad",              display:"Lily Pad",                   cat:"Ocean",        dim:"overworld", yMin:62,  yMax:66   },
  { name:"waterlily",             display:"Waterlily",                  cat:"Ocean",        dim:"overworld", yMin:62,  yMax:66   },
  // Mushrooms
  { name:"brown_mushroom",        display:"Brown Mushroom",             cat:"Mushrooms",    dim:"overworld", yMin:40,  yMax:320  },
  { name:"red_mushroom",          display:"Red Mushroom",               cat:"Mushrooms",    dim:"overworld", yMin:40,  yMax:320  },
  { name:"brown_mushroom_block",  display:"Brown Mushroom Block",       cat:"Mushrooms",    dim:"overworld", yMin:55,  yMax:120  },
  { name:"red_mushroom_block",    display:"Red Mushroom Block",         cat:"Mushrooms",    dim:"overworld", yMin:55,  yMax:120  },
  { name:"huge_brown_mushroom",   display:"Huge Brown Mushroom",        cat:"Mushrooms",    dim:"overworld", yMin:55,  yMax:120  },
  { name:"huge_red_mushroom",     display:"Huge Red Mushroom",          cat:"Mushrooms",    dim:"overworld", yMin:55,  yMax:120  },
  // Fluids
  { name:"water",                 display:"Water",                      cat:"Fluids",       dim:"overworld", yMin:-64, yMax:320  },
  { name:"lava",                  display:"Lava",                       cat:"Fluids",       dim:"overworld", yMin:-64, yMax:10   },
  // Amethyst
  { name:"amethyst_block",        display:"Amethyst Block",             cat:"Amethyst",     dim:"overworld", yMin:-58, yMax:30   },
  { name:"budding_amethyst",      display:"Budding Amethyst",           cat:"Amethyst",     dim:"overworld", yMin:-58, yMax:30   },
  { name:"amethyst_cluster",      display:"Amethyst Cluster",           cat:"Amethyst",     dim:"overworld", yMin:-58, yMax:30   },
  { name:"large_amethyst_bud",    display:"Large Amethyst Bud",         cat:"Amethyst",     dim:"overworld", yMin:-58, yMax:30   },
  { name:"medium_amethyst_bud",   display:"Medium Amethyst Bud",        cat:"Amethyst",     dim:"overworld", yMin:-58, yMax:30   },
  { name:"small_amethyst_bud",    display:"Small Amethyst Bud",         cat:"Amethyst",     dim:"overworld", yMin:-58, yMax:30   },
  // Dripstone
  { name:"pointed_dripstone",     display:"Pointed Dripstone",          cat:"Dripstone",    dim:"overworld", yMin:-64, yMax:100  },
  { name:"dripstone_block",       display:"Dripstone Block",            cat:"Dripstone",    dim:"overworld", yMin:-64, yMax:100  },
  // Mangrove / Mud
  { name:"muddy_mangrove_roots",  display:"Muddy Mangrove Roots",       cat:"Mangrove",     dim:"overworld", yMin:60,  yMax:70   },
  { name:"mud",                   display:"Mud",                        cat:"Mangrove",     dim:"overworld", yMin:58,  yMax:66   },
  { name:"packed_mud",            display:"Packed Mud",                 cat:"Mangrove",     dim:"overworld", yMin:58,  yMax:66   },
  { name:"mud_bricks",            display:"Mud Bricks",                 cat:"Mangrove",     dim:"overworld", yMin:-64, yMax:320  },
  // Archaeology
  { name:"suspicious_sand",       display:"Suspicious Sand",            cat:"Archaeology",  dim:"overworld", yMin:58,  yMax:80   },
  { name:"suspicious_gravel",     display:"Suspicious Gravel",          cat:"Archaeology",  dim:"overworld", yMin:-64, yMax:320  },
  // Trial Chambers (1.21+)
  { name:"trial_spawner",         display:"Trial Spawner",              cat:"Trial Chambers",dim:"overworld",yMin:-20, yMax:40   },
  { name:"vault",                 display:"Vault",                      cat:"Trial Chambers",dim:"overworld",yMin:-20, yMax:40   },
  { name:"ominous_vault",         display:"Ominous Vault",              cat:"Trial Chambers",dim:"overworld",yMin:-20, yMax:40   },
  { name:"ominous_trial_spawner", display:"Ominous Trial Spawner",      cat:"Trial Chambers",dim:"overworld",yMin:-20, yMax:40   },
  { name:"crafter",               display:"Crafter",                    cat:"Trial Chambers",dim:"overworld",yMin:-64, yMax:320  },
  { name:"heavy_core",            display:"Heavy Core",                 cat:"Trial Chambers",dim:"overworld",yMin:-64, yMax:320  },
  // Copper
  { name:"copper_block",          display:"Copper Block",               cat:"Copper",       dim:"overworld", yMin:-64, yMax:320  },
  { name:"exposed_copper",        display:"Exposed Copper",             cat:"Copper",       dim:"overworld", yMin:-64, yMax:320  },
  { name:"weathered_copper",      display:"Weathered Copper",           cat:"Copper",       dim:"overworld", yMin:-64, yMax:320  },
  { name:"oxidized_copper",       display:"Oxidized Copper",            cat:"Copper",       dim:"overworld", yMin:-64, yMax:320  },
  { name:"cut_copper",            display:"Cut Copper",                 cat:"Copper",       dim:"overworld", yMin:-64, yMax:320  },
  { name:"waxed_copper_block",    display:"Waxed Copper Block",         cat:"Copper",       dim:"overworld", yMin:-64, yMax:320  },
  // Structures
  { name:"chest",                 display:"Chest",                      cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"spawner",               display:"Monster Spawner",            cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"infested_stone",        display:"Infested Stone",             cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"infested_deepslate",    display:"Infested Deepslate",         cat:"Structures",   dim:"overworld", yMin:-64, yMax:0    },
  { name:"infested_cobblestone",  display:"Infested Cobblestone",       cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"infested_stone_bricks", display:"Infested Stone Bricks",      cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"infested_mossy_stone_bricks",display:"Infested Mossy Stone Bricks",cat:"Structures",dim:"overworld",yMin:-64,yMax:320 },
  { name:"infested_cracked_stone_bricks",display:"Infested Cracked Stone Bricks",cat:"Structures",dim:"overworld",yMin:-64,yMax:320},
  { name:"infested_chiseled_stone_bricks",display:"Infested Chiseled Stone Bricks",cat:"Structures",dim:"overworld",yMin:-64,yMax:320},
  { name:"chiseled_stone_bricks", display:"Chiseled Stone Bricks",      cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"cracked_stone_bricks",  display:"Cracked Stone Bricks",       cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"mossy_stone_bricks",    display:"Mossy Stone Bricks",         cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"stone_bricks",          display:"Stone Bricks",               cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"mossy_cobblestone",     display:"Mossy Cobblestone",          cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"cobblestone",           display:"Cobblestone",                cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"oak_planks",            display:"Oak Planks",                 cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"bookshelf",             display:"Bookshelf",                  cat:"Structures",   dim:"overworld", yMin:-64, yMax:320  },
  { name:"bone_block",            display:"Bone Block",                 cat:"Structures",   dim:"overworld", yMin:0,   yMax:320  },
  // Terracotta
  { name:"terracotta",            display:"Terracotta",                 cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"white_terracotta",      display:"White Terracotta",           cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"orange_terracotta",     display:"Orange Terracotta",          cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"magenta_terracotta",    display:"Magenta Terracotta",         cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"light_blue_terracotta", display:"Light Blue Terracotta",      cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"yellow_terracotta",     display:"Yellow Terracotta",          cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"lime_terracotta",       display:"Lime Terracotta",            cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"pink_terracotta",       display:"Pink Terracotta",            cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"gray_terracotta",       display:"Gray Terracotta",            cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"light_gray_terracotta", display:"Light Gray Terracotta",      cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"cyan_terracotta",       display:"Cyan Terracotta",            cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"purple_terracotta",     display:"Purple Terracotta",          cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"blue_terracotta",       display:"Blue Terracotta",            cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"brown_terracotta",      display:"Brown Terracotta",           cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"green_terracotta",      display:"Green Terracotta",           cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"red_terracotta",        display:"Red Terracotta",             cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
  { name:"black_terracotta",      display:"Black Terracotta",           cat:"Terracotta",   dim:"overworld", yMin:52,  yMax:80   },
];

const DIM_COLORS: Record<Dim, string> = {
  overworld: "text-emerald-400",
  nether:    "text-red-400",
  end:       "text-purple-400",
};
const DIM_LABELS: Record<Dim, string> = {
  overworld: "OW",
  nether:    "NET",
  end:       "END",
};

interface Step { id: number; block: string; searchRadius: string; clusterRadius: string; filter: string; }
let nextId = 1;
const makeStep = (): Step => ({ id: nextId++, block: "", searchRadius: "500", clusterRadius: "32", filter: "" });

function blockMatches(b: Block, q: string) {
  const lq = q.toLowerCase();
  return b.name.includes(lq) || b.display.toLowerCase().includes(lq) || b.cat.toLowerCase().includes(lq);
}

function BlockPicker({ value, filter, onSelect, onFilterChange, open, onOpen, onClose }: {
  value: string; filter: string;
  onSelect: (name: string) => void;
  onFilterChange: (v: string) => void;
  open: boolean; onOpen: () => void; onClose: () => void;
}) {
  const filtered = filter ? BLOCKS.filter(b => blockMatches(b, filter)) : BLOCKS;
  const cats = [...new Set(filtered.map(b => b.cat))];
  const selected = BLOCKS.find(b => b.name === value);

  return (
    <div className="relative">
      <div
        className="bg-input border border-border rounded-md px-3 py-2 text-sm flex items-center gap-2 cursor-pointer hover:border-primary/60 transition-colors"
        onClick={open ? onClose : onOpen}
      >
        {selected ? (
          <>
            <span className={`text-xs font-mono font-bold ${DIM_COLORS[selected.dim]}`}>{DIM_LABELS[selected.dim]}</span>
            <span className="flex-1 text-foreground">{selected.display}</span>
            <span className="text-xs text-muted-foreground font-mono">{selected.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground flex-1">Choose a block…</span>
        )}
        <span className="text-muted-foreground text-xs">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-xl z-20 flex flex-col" style={{maxHeight:"320px"}}>
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              type="text"
              placeholder="Search blocks…"
              value={filter}
              onChange={e => onFilterChange(e.target.value)}
              className="w-full bg-input border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {cats.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">No blocks match.</div>
            )}
            {cats.map(cat => (
              <div key={cat}>
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground bg-muted/40 sticky top-0">{cat}</div>
                {filtered.filter(b => b.cat === cat).map(b => (
                  <button
                    key={b.name}
                    onMouseDown={() => { onSelect(b.name); onClose(); }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors ${value === b.name ? "bg-accent/60" : ""}`}
                  >
                    <span className={`text-xs font-mono font-bold w-8 shrink-0 ${DIM_COLORS[b.dim]}`}>{DIM_LABELS[b.dim]}</span>
                    <span className="flex-1">{b.display}</span>
                    <span className="text-xs text-muted-foreground font-mono hidden sm:block">{b.yMin}→{b.yMax}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-border text-xs text-muted-foreground flex gap-3">
            <span className={DIM_COLORS.overworld}>● OW overworld</span>
            <span className={DIM_COLORS.nether}>● NET nether</span>
            <span className={DIM_COLORS.end}>● END end</span>
            <span className="ml-auto">{filtered.length} blocks</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Builder({ onTutorial }: { onTutorial?: () => void }) {
  const [seed, setSeed] = useState("");
  const [version, setVersion] = useState("1.18");
  const [centerX, setCenterX] = useState("");
  const [centerZ, setCenterZ] = useState("");
  const [radius, setRadius] = useState("5000");
  const [steps, setSteps] = useState<Step[]>([makeStep()]);
  const [sortKey, setSortKey] = useState<"" | "x" | "z" | "dist">("");
  const [sortDesc, setSortDesc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openPicker, setOpenPicker] = useState<number | null>(null);

  const addStep = () => { if (steps.length < 16) setSteps(s => [...s, makeStep()]); };
  const removeStep = (id: number) => setSteps(s => s.filter(st => st.id !== id));
  const updateStep = (id: number, field: keyof Step, value: string) =>
    setSteps(s => s.map(st => st.id === id ? { ...st, [field]: value } : st));

  const buildCommand = useCallback((): string | null => {
    if (!seed.trim()) return null;
    const validSteps = steps.filter(s => s.block.trim());
    if (validSteps.length === 0) return null;
    const parts = ["./mc-block-finder"];
    parts.push(`-s ${seed.trim()}`);
    parts.push(`-v ${version}`);
    if (centerX.trim() && centerX.trim() !== "0") parts.push(`-x ${centerX.trim()}`);
    if (centerZ.trim() && centerZ.trim() !== "0") parts.push(`-z ${centerZ.trim()}`);
    if (radius.trim() && radius.trim() !== "5000") parts.push(`-r ${radius.trim()}`);
    if (sortKey) parts.push(`-O ${sortKey}`);
    if (sortDesc) parts.push(`-D`);
    for (const step of validSteps) {
      parts.push(`-b ${step.block}`);
      parts.push(`-S ${step.searchRadius || "500"}`);
      parts.push(`-C ${step.clusterRadius || "32"}`);
    }
    return parts.join(" \\\n  ");
  }, [seed, version, centerX, centerZ, radius, sortKey, sortDesc, steps]);

  const command = buildCommand();

  const copyCommand = async () => {
    if (!command) return;
    await navigator.clipboard.writeText(command.replace(/ \\\n  /g, " "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" onClick={() => setOpenPicker(null)}>
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-sm">⛏</div>
        <div>
          <h1 className="font-bold text-lg leading-none">MC Cluster Finder</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Command Builder</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {onTutorial && (
            <button onClick={onTutorial}
              className="text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:border-primary hover:text-primary transition-colors">
              ? Tutorial
            </button>
          )}
          <a href="https://github.com/batthepig-two/MC-block-finder" target="_blank" rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">CLI on GitHub ↗</a>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-6" onClick={e => e.stopPropagation()}>

        {/* World Settings */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">World Settings</h2>
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Seed <span className="text-destructive">*</span></label>
              <input type="text" placeholder="e.g. 123456789 or a text seed" value={seed}
                onChange={e => setSeed(e.target.value)}
                className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Version <span className="text-destructive">*</span></label>
                <select value={version} onChange={e => setVersion(e.target.value)}
                  className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {MC_VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Initial Radius <span className="text-muted-foreground/50">(default 5000)</span></label>
                <input type="number" placeholder="5000" value={radius} onChange={e => setRadius(e.target.value)}
                  className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Center X <span className="text-muted-foreground/50">(optional)</span></label>
                <input type="number" placeholder="0" value={centerX} onChange={e => setCenterX(e.target.value)}
                  className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Center Z <span className="text-muted-foreground/50">(optional)</span></label>
                <input type="number" placeholder="0" value={centerZ} onChange={e => setCenterZ(e.target.value)}
                  className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>
        </section>

        {/* Search Steps */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Steps</h2>
            <span className="text-xs text-muted-foreground">Each step narrows from previous · max 16</span>
          </div>
          <div className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <div key={step.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">Step {i + 1}</span>
                  {steps.length > 1 && (
                    <button onClick={() => removeStep(step.id)} className="text-xs text-destructive hover:opacity-80 transition-opacity">Remove</button>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Block <span className="text-destructive">*</span>
                    <span className="text-muted-foreground/50 ml-1">— {BLOCKS.length} total, search by name or category</span>
                  </label>
                  <BlockPicker
                    value={step.block}
                    filter={step.filter}
                    open={openPicker === step.id}
                    onOpen={() => setOpenPicker(step.id)}
                    onClose={() => setOpenPicker(null)}
                    onSelect={name => updateStep(step.id, "block", name)}
                    onFilterChange={v => updateStep(step.id, "filter", v)}
                  />
                  {step.block && (() => {
                    const b = BLOCKS.find(x => x.name === step.block)!;
                    return (
                      <p className="text-xs text-muted-foreground">
                        <span className={DIM_COLORS[b.dim]}>{b.dim}</span>
                        {" · "}Y {b.yMin} → {b.yMax}
                        {" · "}category: {b.cat}
                      </p>
                    );
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Search Radius <code className="text-muted-foreground/60">-S</code></label>
                    <input type="number" value={step.searchRadius} onChange={e => updateStep(step.id, "searchRadius", e.target.value)}
                      className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <p className="text-xs text-muted-foreground">Blocks around each hit to re-search</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Cluster Radius <code className="text-muted-foreground/60">-C</code></label>
                    <input type="number" value={step.clusterRadius} onChange={e => updateStep(step.id, "clusterRadius", e.target.value)}
                      className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <p className="text-xs text-muted-foreground">Radius seeding the next step</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addStep} disabled={steps.length >= 16}
            className="border border-dashed border-border rounded-lg py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            + Add Step {steps.length >= 16 ? "(max reached)" : ""}
          </button>
        </section>

        {/* Output Options */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output Options</h2>
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Sort Results <code className="text-muted-foreground/60">-O</code></label>
                <select value={sortKey} onChange={e => setSortKey(e.target.value as "" | "x" | "z" | "dist")}
                  className="bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">No sort (default)</option>
                  <option value="dist">Distance from center</option>
                  <option value="x">X coordinate</option>
                  <option value="z">Z coordinate</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 justify-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input type="checkbox" checked={sortDesc} onChange={e => setSortDesc(e.target.checked)}
                    className="rounded border-border accent-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Reverse order <code className="text-muted-foreground/60">-D</code></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Output */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated Command</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {command ? (
              <>
                <pre className="p-4 text-sm font-mono text-primary overflow-x-auto whitespace-pre leading-relaxed">{command}</pre>
                <div className="border-t border-border px-4 py-3 flex items-center justify-between bg-muted/20">
                  <span className="text-xs text-muted-foreground">
                    Run inside the <code className="font-mono bg-muted px-1 rounded">MC-block-finder</code> directory
                  </span>
                  <button onClick={copyCommand}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-sm text-muted-foreground text-center">
                Enter a seed and pick at least one block to generate your command.
              </div>
            )}
          </div>
        </section>

        {/* Quick Install */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Install the CLI</h2>
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2 text-xs text-muted-foreground">
            <p>Works on macOS, Linux, and <strong className="text-foreground">a-Shell</strong> (iOS):</p>
            <pre className="font-mono text-foreground bg-muted rounded-md px-3 py-2 overflow-x-auto whitespace-pre">{`curl -fsSL https://raw.githubusercontent.com/Batthepig-two/MC-block-finder/main/install.sh -o install.sh
sh install.sh
cd MC-block-finder`}</pre>
            <p>Then paste your command above. Use <code className="font-mono bg-muted px-1 rounded">./mc-block-finder -l</code> to list all blocks, or <code className="font-mono bg-muted px-1 rounded">-i</code> for interactive mode.</p>
          </div>
        </section>

      </div>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        Powered by <a href="https://github.com/Cubitect/cubiomes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cubiomes</a>
        {" · "}
        <a href="https://github.com/batthepig-two/MC-block-finder" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CLI source</a>
        {" · "}
        <a href="https://github.com/batthepig-two/mc-cluster-finder-ui" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">UI source</a>
      </footer>
    </div>
  );
}
