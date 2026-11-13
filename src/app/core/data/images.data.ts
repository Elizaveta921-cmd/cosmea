import { CategoryId } from '../models/product.model';

// Прямые ссылки на фотографии. Для локальных файлов замените URL на '/images/имя.jpg'.
// Источники и ссылки для скачивания перечислены в IMAGE_SOURCES.md.
const photo = (src: string, width = 1000): string =>
  src.startsWith('http') ? `${src}${src.includes('?') ? '&' : '?'}width=${width}` : src;

export const PRODUCT_IMAGES: Record<number, string[]> = {
  // 1: Hyaluronic Acid Serum - 30ml
  1: [
    photo("https://cdn.shopify.com/s/files/1/0428/8498/9091/files/Hyaluronic_Acid_30ml_Packshot_5f37fa61-5456-40e5-a0d8-b5ff4489e74f.png?v=1790088559"),
    photo("https://cdn.shopify.com/s/files/1/0428/8498/9091/files/Hyaluronic_Acid_30ml_Shelfie.jpg?v=1789657331"),
    photo("https://cdn.shopify.com/s/files/1/0428/8498/9091/files/Swatch.jpg?v=1730459434"),
  ],
  // 2: Glow Baby Super Lit SPF 30 Lotion
  2: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/PACKAGING_BOTH_dc43835b-89e3-42a4-8eab-2c280fb3040b.jpg?v=1776204429"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/HERO_SWATCHBG_e9d42b2e-af97-4fd7-9d9e-3065896fb377.jpg?v=1776204429"),
  ],
  // 3: Vitamin E Nourishing Night Cream
  3: [
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027003_VITAMIN_E_NIGHT_LOTION_50ML_BRONZE_INAEHPS067_3a1cd76c-dc40-4cea-a11a-4bab39d85b91.jpg?v=1736356590"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027003_NIGHT_CREAM_VITAMIN_E_50ML_A0X_IMAGE_3.jpg?v=1782738927"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027003_NIGHT_CREAM_VITAMIN_E_50ML_A0X_IMAGE_1.jpg?v=1782738926"),
  ],
  // 4: Camomile Gentle Eye Makeup Remover
  4: [
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027766_EYE_MAKE_UP_RMVR_GENT_CAMOMILE_250ML_BRONZE_INAEVPS277.jpg?v=1735827820"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027766_EYE_MUP_RMVR_CAMOMILE_250ML_A0X_IMAGE_4.jpg?v=1782749577"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027766_EYE_MAKE_UP_RMVR_GENT_CAMOMILE_250ML_SWATCH_INAEUPS187.jpg?v=1735827857"),
  ],
  // 5: Happy Water Gentle Skin Toner
  5: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/1_94c43741-733d-4f79-acd8-71c62c3dcea3.jpg?v=1787759769"),
  ],
  // 6: Charcoal Pore-Minimising Mask
  6: [
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027162_CHARCOAL_PORE_MINIMISING_MASK_75ML_BRONZE_INAGRPS262.jpg?v=1739267391"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027162_CHARCOAL_PORE_MINIMISING_MASK_75ML_GOLD_INAGRPS263.jpg?v=1739977164"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027155_CHARCOAL_PORE_MINIMISING_MASK_15ML_SILVER_INAGRPS261.jpg?v=1750179427"),
  ],
  // 7: Vegan Ceramide Hydration Fill Undereye & Smile Line Jelly Patches
  7: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/products/PAC_VEGAN_CERAMIDE_UNDEREYE_SMILE_LINE_PATCHES.jpg?v=1625847343"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/products/veganceramide_patches_2050-crop.jpg?v=1641587609"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/products/Ashton_Eye_Patches_1024.jpg?v=1644006794"),
  ],
  // 8: Light 40 N
  8: [
    photo("https://cdn.shopify.com/s/files/1/1338/0845/products/4690204655698-Light-40-N-PFFoundation-Light40N-1.jpg?v=1668563972"),
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/Light-40N_PFGrid_Foundation.jpg?v=1726781732"),
  ],
  // 9: Slow Burn
  9: [
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/Kit-SlowBurn-Stylized-Into-Lit.jpg?v=1736969414"),
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/Kit_SlowBurn_Macro_7675.jpg?v=1736969420"),
  ],
  // 10: Activist Volume Mascara
  10: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/PAC-Mascara-ActivistVolume.png?v=1776822369"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/products/PAC_ACTIVIST_MASCARA_INFOGRAPHICS_blank_images_hero-tight-crop.jpg?v=1723837691"),
  ],
  // 11: Pink Dreams
  11: [
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/PinkDreams_EyePalette_Model_FullFace_ECOM.jpg?v=1786281193"),
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/PinkDreams_EyePalette_ProductStylized.jpg?v=1776787995"),
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/PinkDreams_EyePalette_Model_FullFace_Deep.jpg?v=1776787995"),
  ],
  // 12: Cuter than Cupid
  12: [
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/HeartToGet_SSBlush_CuterThanCupid_ProductStylized.jpg?v=1768423713"),
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/HeartToGet_Bundle_SorryNotSorry_ModelFullFace.jpg?v=1768423713"),
  ],
  // 13: Platinum Aura
  13: [
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/PinkDreams_SuperShockHighlighter_PlatinumAura_ProductStylized_Pillow.jpg?v=1776788208"),
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/PinkDreams_SuperShockHighlighter_PlatinumAura_Swatch.jpg?v=1786281149"),
  ],
  // 14: Ash Brown
  14: [
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/BrowBossBrowPencil_AshBrown_ECOM.jpg?v=1766262097"),
    photo("https://cdn.shopify.com/s/files/1/1338/0845/files/BrowBossBrowPencil_Blonde_Macro_Eye_Grid.jpg?v=1766262267"),
  ],
  // 15: Coco Peptide Damage Care Shampoo
  15: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/products/PAC_COCO_PEPTIDE_DAMAGE_CARE_SHAMPOO.jpg?v=1744841145"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/products/TARGET_COCO_PEPTIDE_DAMAGE_CARE_SHAMPOO_MODEL_020923.jpg?v=1744841145"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/products/PAC_COCO_PEPTIDE_DAMAGE_CARE_SHAMPOO_SWATCH.png?v=1776822368"),
  ],
  // 16: Shea Intense Repair Hair Mask
  16: [
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/SHEA_INTENSE_REPAIR_HAIR_MASK_240ml_1_INAAUPS026_43bab322-149a-4264-adbb-c2c04d84cdc4.jpg?v=1736346714"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1018002_20HAIR_20MASK_20SHEA_20RENO_20240ML_20A0X_20IMAGE_204_2048.jpg?v=1782808625"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1018002_20HAIR_20MASK_20SHEA_20RENO_20240ML_20A0X_20IMAGE_201_2048.jpg?v=1782808624"),
  ],
  // 17: Jasmine Agave Strength + Shine Hair Oil
  17: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/Pacifica_Jasmine_Agave_Strength_Shine_Hair_Oil.jpg?v=1782954315"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/Pacifica_Jasmine_Agave_Strength_Shine_Hair_Oil_Swatch.jpg?v=1782954315"),
  ],
  // 18: 11 in 1 Magical Leave-In Treatment
  18: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/1_11_IN_1_MAGICAL_LEAVE_IN_TREATMENT_64200_HERO.jpg?v=1744841130"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/2_11_IN_1_MAGICAL_LEAVE_IN_TREATMENT_64200_MODEL_2.jpg?v=1744841130"),
  ],
  // 19: Coffee Body Scrub - 100 g
  19: [
    photo("https://cdn.shopify.com/s/files/1/1454/5188/files/Card-1_option1_1_96ded4cb-8614-4bea-9afc-d0318a255f36.jpg?v=1789647802"),
    photo("https://cdn.shopify.com/s/files/1/1454/5188/files/card-3_b6622743-dfbe-4e1c-9041-7b1394245917.jpg?v=1789647802"),
  ],
  // 20: British Rose Lotion-to-Milk 200ml
  20: [
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1097356_BODY_LOTION_BRITISH_ROSE_BRNZ_INAAUPS139_64271182-9399-46ad-b891-02034666178f.jpg?v=1759844573"),
  ],
  // 21: Vanilla Bath & Shower Gel
  21: [
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1046202_BATH___SHOWER_CREAM_VANILLA_250ML_A0X_FAFAFA_INAKNPS043.jpg?v=1781279105"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1046202VanillaShowerGel_TheBodyShop_Texture_21_INAKNPS097.jpg?v=1781279077"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1046203_Vanilla_Ingredient_The_Body_Shop_Ingredient_07_INAKNPS066_bf05bdaf-f51b-485f-95a9-e185aa33281b.jpg?v=1781279078"),
  ],
  // 22: Shea Hand Balm
  22: [
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1031286_SHEA_HAND_BALM_30ML_BRONZ_INAEHPS029_c87fac2a-3dc8-4ef8-b513-b2201aacc0b9.jpg?v=1744293959"),
    photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1031286_SHEA_HAND_BALM_30ML_SILVER_INAEHPS193.jpg?v=1736347797"),
  ],
  // 23: Oud de Rose
  23: [
    photo("https://cdn.shopify.com/s/files/1/0047/4067/7699/files/Oud-De-Rose_5886a799-2162-4070-b7c5-bf0f75b0e8a6.jpg?v=1792144410"),
    photo("https://cdn.shopify.com/s/files/1/0047/4067/7699/files/OudDeRosegradient.jpg?v=1792144440"),
  ],
  // 24: Citrus Tea
  24: [
    photo("https://cdn.shopify.com/s/files/1/0047/4067/7699/files/Citrus_Tea_1a445760-2597-4879-bde5-3fdf51dd8170.jpg?v=1779275657"),
    photo("https://cdn.shopify.com/s/files/1/0047/4067/7699/files/Citrus_Tea_a00515c0-2495-4566-bac7-75ec28d3f5cf.jpg?v=1779275692"),
  ],
  // 25: Island Vanilla Hair & Body Mist
  25: [
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/PAC_ISLAND_VANILLA_HAIR_BODY_MIST.jpg?v=1707345081"),
    photo("https://cdn.shopify.com/s/files/1/1515/0462/files/IslandVanillaH_BMist_SCENTHERO.jpg?v=1776822369"),
  ],
};

export const CATEGORY_IMAGES: Record<CategoryId, string> = {
  face: photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027003_NIGHT_CREAM_VITAMIN_E_50ML_A0X_IMAGE_3.jpg?v=1782738927", 800),
  makeup: photo("https://cdn.shopify.com/s/files/1/1338/0845/files/PinkDreams_EyePalette_ProductStylized.jpg?v=1776787995", 800),
  hair: photo("https://cdn.shopify.com/s/files/1/1515/0462/products/TARGET_COCO_PEPTIDE_DAMAGE_CARE_SHAMPOO_MODEL_020923.jpg?v=1744841145", 800),
  body: photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1031286_SHEA_HAND_BALM_30ML_SILVER_INAEHPS193.jpg?v=1736347797", 800),
  fragrance: photo("https://cdn.shopify.com/s/files/1/0047/4067/7699/files/OudDeRosegradient.jpg?v=1792144440", 800),
};

export const HOME_IMAGES = {
  face: photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027003_NIGHT_CREAM_VITAMIN_E_50ML_A0X_IMAGE_3.jpg?v=1782738927", 1600),
  makeup: photo("https://cdn.shopify.com/s/files/1/1338/0845/files/PinkDreams_EyePalette_ProductStylized.jpg?v=1776787995", 1600),
  fragrance: photo("https://cdn.shopify.com/s/files/1/0047/4067/7699/files/OudDeRosegradient.jpg?v=1792144440", 1600),
  ritual: photo("https://cdn.shopify.com/s/files/1/0840/6679/5785/files/1027162_CHARCOAL_PORE_MINIMISING_MASK_75ML_GOLD_INAGRPS263.jpg?v=1739977164", 1600),
};
