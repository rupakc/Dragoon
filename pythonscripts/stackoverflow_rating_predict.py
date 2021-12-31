import classificationutils
import hashfeatures
import sys
import preprocess


regressor_file_path = 'C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\stackoverflow_score_regressor.bin'


def get_predicted_rating(title_list_string):
    title_list = title_list_string.split('|')
    cleaned_title_list =preprocess.text_clean_pipeline_list(title_list)
    feature_set = hashfeatures.FeatureHash(max_feature_num=1000).get_feature_set(cleaned_title_list)
    regressor = classificationutils.load_classifier(regressor_file_path)
    predicted_rating_list = map(lambda x:str(x),regressor.predict(feature_set))
    return "|".join(predicted_rating_list)


if __name__ == "__main__":
    title_string_list = sys.argv[1]
    print(get_predicted_rating(title_string_list))
