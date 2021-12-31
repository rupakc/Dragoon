import sys
import classificationutils
import hashfeatures

regressor_file_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\book_rating_regressor.bin"


def book_rating_helper(author_title_string):
    return author_title_string.split('|')


def get_book_rating(author_title_string):
    author_title_list = book_rating_helper(author_title_string)
    feature_set = hashfeatures.FeatureHash(max_feature_num=10).get_feature_set(author_title_list)
    book_rating_regressor = classificationutils.load_classifier(regressor_file_path)
    return book_rating_regressor.predict(feature_set)


if __name__ == "__main__":
    author_title_string = sys.argv[1]
    print get_book_rating(author_title_string)
