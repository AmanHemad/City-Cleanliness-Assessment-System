import os
import shutil

def safe_move(src, dest_folder):
    base, ext = os.path.splitext(os.path.basename(src))
    dest = os.path.join(dest_folder, base + ext)

    counter = 1
    while os.path.exists(dest):
        dest = os.path.join(dest_folder, f"{base}_{counter}{ext}")
        counter += 1

    shutil.move(src, dest)

def merge_sub_subfolders(root):
    for child in os.listdir(root):
        child_path = os.path.join(root, child)

        if os.path.isdir(child_path):

            for grandchild in os.listdir(child_path):
                grandchild_path = os.path.join(child_path, grandchild)

                if os.path.isdir(grandchild_path):

                    for item in os.listdir(grandchild_path):
                        source = os.path.join(grandchild_path, item)
                        safe_move(source, child_path)

                    os.rmdir(grandchild_path)

root = input("Enter folder path: ")
merge_sub_subfolders(root)