import preprocess
import hashfeatures
import classificationutils
import sys

classifier_full_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\multioutput_classifier.bin"
encoder_full_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\label_encoder.bin"


def get_ingredient_list(dish_name_list,classifier_path=classifier_full_path,encoder_path=encoder_full_path):
    preprocess_list = preprocess.text_clean_pipeline_list(dish_name_list)
    dish_feature_list = hashfeatures.FeatureHash(max_feature_num=10).get_feature_set(preprocess_list)
    multioutput_classifier = classificationutils.load_classifier(classifier_path)
    label_encoder = classificationutils.load_classifier(encoder_path)
    encoded_predicted_ingredients = multioutput_classifier.predict(dish_feature_list)
    master_ingredient_list = []
    dish_ingredient_dict = dict({})
    for encoded_ingredient_list in encoded_predicted_ingredients:
        master_ingredient_list.append(label_encoder.inverse_transform(encoded_ingredient_list))
    for ingredient_list,dish_name in zip(master_ingredient_list, dish_name_list):
        dish_ingredient_dict[dish_name] = ",".join(ingredient_list)
    return dish_ingredient_dict


def parse_recipe_name_string(recipe_name_string):
    recipe_list = recipe_name_string.strip().split('|')
    return recipe_list


if __name__ == "__main__":
    recipe_string = sys.argv[1]
    print get_ingredient_list(parse_recipe_name_string(recipe_string))
