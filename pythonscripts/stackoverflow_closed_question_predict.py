import classificationutils
import sys
import preprocess

feature_model_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\closed_question_tfidf_model.bin"
classifier_model_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\svm_closed_question_prediction.bin"


def get_answer_status(question_string_list):
    question_list = question_string_list.split("|")
    cleaned_question_list = preprocess.text_clean_pipeline_list(question_list)
    feature_model = classificationutils.load_classifier(feature_model_path)
    classifier = classificationutils.load_classifier(classifier_model_path)
    feature_set = feature_model.get_feature_set(cleaned_question_list)
    predicted_status_list = classifier.predict(feature_set)
    return "|".join(predicted_status_list)


if __name__ == "__main__":
    question_string_list = sys.argv[1]
    print(get_answer_status(question_string_list))
