import sys
import classificationutils
import hashfeatures

classifier_file_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\book_genre_prediction_text.bin"


def get_book_genre(title_author_string, separator='|'):
    title_author_list = title_author_string.split(separator)
    title_author_list = map(lambda x:x.lower(), title_author_list)
    genre_classifier = classificationutils.load_classifier(classifier_file_path)
    genre_feature_set = hashfeatures.FeatureHash(max_feature_num=10).get_feature_set(title_author_list)
    genre_list_string = "|".join(genre_classifier.predict(genre_feature_set))
    return genre_list_string


if __name__ == "__main__":
    genre_list_string = get_book_genre(sys.argv[1])
    print genre_list_string
