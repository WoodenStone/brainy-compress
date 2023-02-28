import os
import sys

# see: https://stackoverflow.com/questions/53934591/when-i-try-to-generate-files-for-protobuf-i-get-error-modulenotfounderror
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))