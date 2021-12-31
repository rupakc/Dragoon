import hashfeatures
import classificationutils
import sys

classifier_path = 'C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\svm_trivia_predictor.bin'


def get_predicted_question_types(question_string_list):
    question_list = question_string_list.split('|')
    hash_features = hashfeatures.FeatureHash(max_feature_num=1000).get_feature_set(question_list)
    question_classifier = classificationutils.load_classifier(classifier_path)
    question_types = list(question_classifier.predict(hash_features))
    return "|".join(question_types)


if __name__ == "__main__":
    question_string = sys.argv[1]
    print(get_predicted_question_types(question_string))
