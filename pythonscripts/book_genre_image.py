from keras.models import load_model
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
import numpy as np
import os
import sys

inverse_label_dict = {0: 'Arts & Photography', 1: 'Biographies & Memoirs', 2: 'History', 3: 'Romance', 4: 'Science Fiction & Fantasy'}
image_directory_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\public\\downloads"
saved_model_path = "C:\\Users\\rupachak\\Documents\\Github\\Dragoon\\models\\book_genre_model.h5"


def get_image_and_class_labels(directory_path):
    image_filename_list = os.listdir(directory_path)
    master_image_list = list([])
    for image_filename in image_filename_list:
        image_path = os.path.join(directory_path, image_filename)
        image = load_img(image_path, target_size=(224, 224))
        master_image_list.append(preprocess_input(img_to_array(image)))
    return np.array(master_image_list), image_filename_list


def get_book_genre_list(image_directory_path=image_directory_path, classifier_path=saved_model_path):
    image_list, image_filename_list = get_image_and_class_labels(image_directory_path)
    train_model = load_model(classifier_path)
    image_labels = train_model.predict(image_list)
    book_image_filename_genre_dict = dict({})
    for index, image_class_array in enumerate(image_labels):
        book_image_filename_genre_dict[image_filename_list[index]] = inverse_label_dict[np.argmax(image_class_array)]
    return book_image_filename_genre_dict


if __name__ == "__main__":
    print(get_book_genre_list())
