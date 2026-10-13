import os
import zipfile
import sys

def create_project_zip():
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    output_filename = os.path.join(base_dir, "orientamento-lavoro-roma.zip")

    # Exclude directories and patterns
    exclude_dirs = {
        'node_modules',
        'dist',
        '.git',
        '.aistudio',
        '__pycache__',
        '.cache',
        '.vscode'
    }

    exclude_files = {
        'orientamento-lavoro-roma.zip',
        '.DS_Store',
        'server.js'
    }

    exclude_extensions = {
        '.zip',
        '.tar.gz',
        '.pyc',
        '.log'
    }

    print(f"Creating ZIP from: {base_dir}")
    print(f"Destination: {output_filename}")

    total_files = 0
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_dir):
            # Modify dirs in-place to avoid recursing into excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]

            # Skip root if it starts with an excluded dir
            rel_root = os.path.relpath(root, base_dir)
            if any(part in exclude_dirs or part.startswith('.') for part in rel_root.split(os.sep) if part != '.'):
                continue

            for file in files:
                if file in exclude_files:
                    continue
                if file.startswith('.') and file != '.gitignore' and file != '.env.example':
                    continue
                ext = os.path.splitext(file)[1].lower()
                if ext in exclude_extensions:
                    continue

                abs_file_path = os.path.join(root, file)
                rel_file_path = os.path.relpath(abs_file_path, base_dir)
                
                # Check file size (skip gigantic binary files if any)
                size = os.path.getsize(abs_file_path)
                if size > 15 * 1024 * 1024: # skip files > 15MB
                    continue

                zipf.write(abs_file_path, arcname=rel_file_path)
                total_files += 1

    zip_size_mb = os.path.getsize(output_filename) / (1024 * 1024)
    print(f"Successfully created ZIP with {total_files} files.")
    print(f"Archive size: {zip_size_mb:.2f} MB")
    return output_filename, total_files, zip_size_mb

if __name__ == "__main__":
    create_project_zip()
