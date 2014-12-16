# -*- encoding: utf-8 -*-
# http://www.d-wood.com/blog/2014/02/27_5706.html

require 'csv'
require 'yaml'
require 'pp'

path_to_csv = 'public_notice.csv'
path_to_yaml = 'public_notice.yml'

csv = CSV.read(path_to_csv, :headers => true).map(&:to_hash)

hash = csv

hash.each do |line|
  path = line["path"].dup
  path.encode!('UTF-8')
  path.gsub!(/[ぁ-んァ-ヴ一-龠Ａ-Ｚｱ-ﾝーｰｬｭｮｧ-ｫｯﾞﾟ゙゚（）「」『』・／＆　]+/, '')
  #p path
  line["path"] = path
end

File.open(path_to_yaml, 'w') { |f| f.write(hash.to_yaml) }
pp YAML.load_file(path_to_yaml)

# %20 => ''
# %28 => '('
# %29 => ')'
# %2B => '+'

# EOF