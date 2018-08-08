#-*-coding:utf-8-*-
import os
import sys
import shutil

project_dir = "/Users/yongjiezhang/creatorPro/Baijiale"
package_dir = "packageAssets"

isMaster = True

def pack(versionStr):
	# os.chdir(project_dir)
	
	# if index >= len(cfg):
	# 	return
	# config = cfg[index]

	# #分别到目录拉远程的
	# os.chdir("../cfg")
	# cygwin_cmd = 'git pull origin dev'
	# os.system(cygwin_cmd)
	# os.chdir("../shape")
	# cygwin_cmd = 'git pull origin dev'
	# os.system(cygwin_cmd)

	# #生成表数据并复制
	# os.chdir("../tools/gen_data")
	# # cygwin_cmd = 'python gen.py item_data'
	# cygwin_cmd = 'python gen.py ' + config[1]
	# os.system(cygwin_cmd)
	# # shutil.copy2("./out/cli/item_data.lua", "../../client/src/data/item_data.lua")
	# shutil.copy2("./out/cli/" + config[1] + ".lua", "../../client/src/data/" + config[1] + ".lua")

	# #复制itemicon资源到tps/xx/res下并打包
	# os.chdir("../../client")
	# # copy_to = "./tps/item_icon/02/res"
	# copy_to = config[2]
	# shutil.rmtree(copy_to)
	# # shutil.copytree("../shape/6.tu_biao/item_icon/2", copy_to)
	# shutil.copytree(config[3], copy_to)
	# # cygwin_cmd = 'TexturePacker ./tps/item_icon/02/item_icon_2.tps'
	# cygwin_cmd = 'TexturePacker ' + config[4]
	# os.system(cygwin_cmd)

	# #更新SVN
	# client = pysvn.Client()
	# client.revert(svn_dir, True)
	# client.update(svn_dir)
	# # shutil.copy2(project_dir + "/src/data/item_data.lua", svn_dir + "/src/data/item_data.lua")
	# shutil.copy2(project_dir + "/src/data/" + config[1] + ".lua", svn_dir + "/src/data/" + config[1] + ".lua")
	# # shutil.copy2(project_dir + "/res/ui/common/item_icon_2.plist", svn_dir + "/res/ui/common/item_icon_2.plist")
	# shutil.copy2(project_dir + "/res/ui" + config[5], svn_dir + "/res/ui" + config[5])
	# # shutil.copy2(project_dir + "/res/ui/common/item_icon_2.pvr.ccz", svn_dir + "/res/ui/common/item_icon_2.pvr.ccz")
	# shutil.copy2(project_dir + "/res/ui" + config[6], svn_dir + "/res/ui" + config[6])
	# client.checkin([svn_dir], 'log~~')

	# print("update complete")
	# os.system("pause")
	os.chdir(project_dir)
	shutil.rmtree(package_dir)
	#正式服
	if (isMaster):
		# cmd = "node version_generator.js -v " + versionStr + " -u http://120.78.177.52/baijialeMaster/ -s build/jsb-default/ -d ./"
		cmd = "node version_generator.js -v " + versionStr + " -u http://gameres.ddpkcc.com/baijiale_proxy/baijialeMaster/ -s build/jsb-default/ -d ./"
	else:
		cmd = "node version_generator.js -v " + versionStr + " -u http://gameres.ddpkcc.com/baijiale_proxy/baijialeTest/ -s build/jsb-default/ -d ./"
	os.system(cmd)
	if not os.path.exists(package_dir):
		os.mkdir(package_dir)
	
	# os.mkdir(package_dir + "/master")
	# os.mkdir(package_dir + "/test")
	if (isMaster):
		# shutil.copy2("project.manifest", package_dir + "/master/project.manifest")
		# shutil.copy2("version.manifest", package_dir + "/master/version.manifest")
		#需要更新assets下的project.manifest
		shutil.copy2("project.manifest", "assets/master/project.manifest")
	else:
		# shutil.copy2("project.manifest", package_dir + "/test/project.manifest")
		# shutil.copy2("version.manifest", package_dir + "/test/version.manifest")
		#需要更新assets下的project.manifest
		shutil.copy2("project.manifest", "assets/test/project.manifest")

	shutil.copy2("project.manifest", package_dir + "/project.manifest")
	shutil.copy2("version.manifest", package_dir + "/version.manifest")
	
	shutil.copytree("build/jsb-default/src", package_dir + "/src")
	shutil.copytree("build/jsb-default/res", package_dir + "/res")
	


def main():
	print("输入版本号")
	result = raw_input()
	print("是否正式版本 Y/N")
	result2 = raw_input()
	if (result2 == "N"):
		global isMaster
		isMaster = False
	pack(result)

if __name__ == '__main__':
	main()