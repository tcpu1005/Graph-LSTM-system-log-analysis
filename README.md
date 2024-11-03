<!-- 데이터셋 github에 안올라가서 아래 명령어 실행 해야됨. -->
<!-- git lfs track "data/anomaly_label.csv"
git lfs track "data/Event_occurrence_matrix.csv"
git lfs track "data/Event_traces.csv"
git lfs track "data/Detailed_Type_Error_Descriptions.csv"
git lfs track "data/HDFS.log_templates.csv"



git add .gitattributes
git commit -m "Add large preprocessed files to Git LFS tracking"

.gitignore 파일에도 추가
data/anomaly_label.csv
data/Event_occurrence_matrix.csv
data/Event_traces.csv
data/Detailed_Type_Error_Descriptions.csv
data/HDFS.log_templates.csv

git rm --cached data/anomaly_label.csv
git rm --cached data/Event_occurrence_matrix.csv
git rm --cached data/Event_traces.csv
git rm --cached data/Detailed_Type_Error_Descriptions.csv
git rm --cached data/HDFS.log_templates.csv

git commit -m "Remove large preprocessed files and update .gitignore"
git push origin --force jihuns_work -->
