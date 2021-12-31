# -*- coding: utf-8 -*-
"""
Created on Fri March 25 18:08:00 2016
A Set of utility functions for saving and loading classifiers
@author: Rupak Chakraborty
"""

import pickle

"""
Given a filename and a classifier saves it for further use

Params:
--------
filename: String containing the filename to which the classifier is to be pickled
classifier: Any general classifier object which is to be saved

"""


def save_classifier(filename, classifier):
    save_file = open(filename, "wb")
    pickle.dump(classifier, save_file)
    save_file.close()


"""
Given a filename containing a pre-trained classifier loads it in memory and returns its object representation

Params:
---------
filename: String containing the file from which the classifier is to be retrieved

Returns:
----------
Pre-trained classifier object contained in the filename
"""


def load_classifier(filename):
    classifier_file = open(filename, "rb")
    classifier = pickle.load(classifier_file)
    classifier_file.close()
    return classifier
